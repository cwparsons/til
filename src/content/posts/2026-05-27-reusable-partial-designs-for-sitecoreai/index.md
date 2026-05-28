---
title: Reuseable partial design for SitecoreAI
description: "Combine multiple components together into a partial design and then reuse it within SitecoreAI placeholders."
pubDate: 2026-05-27
tags: ['sitecore']
---

Previously, Sitecore Experience Accelerator (SXA) allowed for [Snippets](https://doc.sitecore.com/xp/en/developers/sxa/104/sitecore-experience-accelerator/configure-a-snippet.html), which allowed for
content that was made up of multiple renderings to be reused across a site.

SitecoreAI has a similar concept of partial designs, where components can be
composed and reused across pages, but they completely take over the placeholder
they live in. So if you create a header partial design and place it in the
`headless-header` placeholder for a page design, individual pages cannot put
additional components within the placeholder. This prevents using partial
designs in any placeholder, but instead just very fixed places.

Instead, I wanted to be able to use them like a component and be able to drop in
a partial design in any placeholder, around any component. So after some
research, I realized I was able to get the contents of a partial design, and
just create my own component.

## Partial design component

The component uses a *Datasource Location** that matches where partial designs
are created by default:

`query:$site/*[@@name='Presentation']/*[@@templatename='Partial Designs']|query:$sharedSites/*[@@name='Presentation']/*[@@templatename='Partial Designs']`

Then a *Datasource Template* of *Partial Design*:

`/sitecore/templates/Foundation/JSS Experience Accelerator/Presentation/Partial Design`

## Code

```tsx
// PartialDesignComponent.tsx
import { useContext } from 'react';

import type { LayoutServiceData, PlaceholdersData } from '@sitecore-content-sdk/nextjs';
import {
  type ComponentParams,
  ComponentPropsContext,
  ComponentPropsReactContext,
  type ComponentRendering,
  type GetComponentServerProps,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';

import componentMap from '@/../.sitecore/component-map';
import { getGraphQlClient } from '@/utils/graphql-client';

// Placeholder where components are added to within the partial design.
const MAIN_PLACEHOLDER = 'headless-main';

// GraphQL query to fetch the partial design "page".
const GET_PARTIAL_DESIGN_QUERY = `
  query GetPartialDesign($datasource: String!, $language: String!) {
    item(path: $datasource, language: $language) {
      rendered
    }
  }
`;

type ComponentProps = {
  item?: {
    rendered: {
      sitecore: {
        route: {
          name: string;
          placeholders: {
            [MAIN_PLACEHOLDER]: ComponentRendering[];
          };
        };
      };
    };
  };
  params: ComponentParams;
  dataSource?: string;
  /** Merged getComponentServerProps results for each child rendering (keyed by uid) */
  componentProps?: Record<string, unknown>;
};

type PartialDesignResponse = {
  item: ComponentProps['item'];
};

type ComponentMapEntry = {
  getComponentServerProps?: GetComponentServerProps;
  dynamicModule?: () => Promise<unknown>;
};

/** Recursively flatten all renderings from placeholders */
function flattenRenderings(placeholders: PlaceholdersData | undefined): ComponentRendering[] {
  if (!placeholders) return [];

  const list: ComponentRendering[] = [];

  for (const renderings of Object.values(placeholders)) {
    for (const r of renderings) {
      list.push(r);

      if (r.placeholders) {
        list.push(...flattenRenderings(r.placeholders));
      }
    }
  }

  return list;
}

/** Resolve component module (handles dynamicModule) */
async function getResolvedModule(
  components: Map<string, ComponentMapEntry>,
  componentName: string,
): Promise<{ getComponentServerProps?: GetComponentServerProps } | null> {
  const component = components.get(componentName);

  if (!component) return null;

  const resolved = component.dynamicModule == null ? component : await component.dynamicModule();

  return resolved as { getComponentServerProps?: GetComponentServerProps };
}

export const Default = ({ item, params, componentProps: partialChildProps }: ComponentProps) => {
  const componentPropsContext = useContext(ComponentPropsReactContext);

  if (!item?.rendered?.sitecore?.route) {
    return null;
  }

  const { name: routeName, placeholders } = item.rendered.sitecore.route;
  const { DynamicPlaceholderId, styles } = params;
  const placeholderName = `partial-design-component-${DynamicPlaceholderId}`;

  const rendering = {
    name: routeName,
    placeholders: {
      [placeholderName]: placeholders[MAIN_PLACEHOLDER],
    },
  };

  // Merge our child getComponentServerProps results into context so Placeholder lookups find them
  const mergedComponentProps = {
    ...componentPropsContext,
    ...partialChildProps,
  };

  return (
    <div className={`component ${styles}`}>
      <ComponentPropsContext value={mergedComponentProps}>
        <Placeholder name={placeholderName} rendering={rendering} />
      </ComponentPropsContext>
    </div>
  );
};

export const getComponentServerProps: GetComponentServerProps = async (
  rendering,
  layoutData,
  context,
) => {
  if (!rendering.dataSource) {
    return {};
  }

  const graphQLClient = getGraphQlClient();
  const result = await graphQLClient.request<PartialDesignResponse>(GET_PARTIAL_DESIGN_QUERY, {
    datasource: rendering.dataSource,
    language: layoutData?.sitecore?.context?.language,
  });

  // Return empty object if item is missing
  if (!result?.item) {
    return {};
  }

  const placeholders = result.item?.rendered?.sitecore?.route?.placeholders;
  const childRenderings = flattenRenderings(placeholders);
  const componentProps: Record<string, unknown> = {};

  // Get the results from every component that uses `getComponentServerProps`
  await Promise.all(
    childRenderings.map(async (childRendering) => {
      const uid = childRendering.uid;

      if (!uid) return;

      const resolvedModule = await getResolvedModule(
        componentMap as Map<string, ComponentMapEntry>,
        childRendering.componentName,
      );

      if (!resolvedModule?.getComponentServerProps) return;

      const childProps = await resolvedModule.getComponentServerProps(
        childRendering,
        (layoutData ?? { sitecore: { route: null } }) as LayoutServiceData,
        context,
      );

      componentProps[uid] = childProps ?? {};
    }),
  );

  return {
    ...result,
    dataSource: rendering.dataSource,
    componentProps,
  };
};
```
