---
title: Reusable partial design component for SitecoreAI
description: "Combine multiple components into a partial design, then reuse it within SitecoreAI placeholders."
pubDate: 2026-05-27
tags: ['sitecore']
---

Previously, Sitecore Experience Accelerator (SXA) supported [Snippets](https://doc.sitecore.com/xp/en/developers/sxa/104/sitecore-experience-accelerator/configure-a-snippet.html),
which allowed content made up of multiple renderings to be reused across a site.

SitecoreAI has a similar concept called partial designs. Components can be
composed and reused across pages, but they take over the placeholder they live
in. For example, if you create a header partial design and place it in the
`headless-header` placeholder for a page design, individual pages cannot put
additional components within that placeholder. This limits partial designs to
fixed placeholders instead of letting you use them anywhere.

Instead, I wanted to use partial designs like components: drop one into any
placeholder, around any other component. After some research, I found I could
fetch the contents of a partial design and create my own component.

## Warning

This is not the intended usage of partial designs and may not be supported.
Use at your own risk.

## Partial design component

The component uses a *Datasource Location* that matches where partial designs
are created by default:

`query:$site/*[@@name='Presentation']/*[@@templatename='Partial Designs']|query:$sharedSites/*[@@name='Presentation']/*[@@templatename='Partial Designs']`

Then set the *Datasource Template* to *Partial Design*:

`/sitecore/templates/Foundation/JSS Experience Accelerator/Presentation/Partial Design`

## Code

```tsx
// PartialDesignComponent.tsx
import { useContext } from 'react';

import {
  type ComponentParams,
  ComponentPropsContext,
  ComponentPropsReactContext,
  type ComponentRendering,
  type GetComponentServerProps,
  type LayoutServiceData,
  Placeholder,
  type PlaceholdersData,
} from '@sitecore-content-sdk/nextjs';

import componentMap from '@/../.sitecore/component-map';
import { getGraphQlClient } from '@/utils/graphql-client';

// Placeholder where components are added within the partial design.
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

  // Return an empty object if the item is missing.
  if (!result?.item) {
    return {};
  }

  const placeholders = result.item?.rendered?.sitecore?.route?.placeholders;
  const childRenderings = flattenRenderings(placeholders);
  const componentProps: Record<string, unknown> = {};

  // Get the results from every component that uses `getComponentServerProps`.
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
