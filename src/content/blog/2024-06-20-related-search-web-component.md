---
title: 'Related search web component for PnP Modern Search'
description: 'A web component for showing related search results within a PnP Modern Search result.'
pubDate: June 20, 2024
tags: ['spfx', 'web-components']
---

A web component for showing related search results within a [PnP Modern Search](https://microsoft-search.github.io/pnp-modern-search/) result. At work, this was used within a `pnp-panel` web component to show documents related to the original search result.

This is best added by creating PnP Modern Search [extensibility library](https://microsoft-search.github.io/pnp-modern-search/extensibility/).

It allows using a number of tokens, like `{searchTerms}`, `{inputQueryText}`, `{TenantUrl}`, `{Hub.HubSiteId}` and `{Today}`, and supports audience targeting.

````typescript
import { SPHttpClient } from '@microsoft/sp-http';
import { PageContext } from '@microsoft/sp-page-context';
import { BaseWebComponent } from '@pnp/modern-search-extensibility';

/**
 * A web component that can display its own search results using Handlebars.
 *
 * Usage:
 *
 * ```html
 * <pnp-search
 *    query="test*"
 *    row-limit="10"
 *    select-properties="Title,Path,Description"
 *    sort-direction="1"
 *    sort-property="Created"
 *    use-audience-targeting="true"
 * >
 *     <template>
 *        <ul>
 *        {{#each results}}
 *            <li>
 *                <a href="{{Path}}">{{Title}}</a>
 *                {{#if Description}}<p>{{Description}}</p>{{/if}}
 *            </li>
 *        {{/each}}
 *        </ul>
 *     </template>
 * </pnp-search>
 * ```
 *
 * Since the inner template uses Handlebars, if the web component is to be used
 * within a Handlebars component, the inner template needs to be escaped using
 * `{{{{raw}}}}` and `{{{{/raw}}}}`.
 */
export class SearchWebComponent extends BaseWebComponent {
  private readonly DEFAULT_ROW_LIMIT = 10;
  private readonly DEFAULT_SELECTED_PROPERTIES = ['Title', 'Path', 'Description'];
  private readonly DEFAULT_SOURCE_ID = '8413cd39-2156-4e00-b54d-11efd9abdb89';

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
  }

  public async connectedCallback() {
    await this.render();
  }

  private async render() {
    const QueryTemplate = this.getAttribute('query');
    const RowLimit = parseInt(this.getAttribute('row-limit') ?? this.DEFAULT_ROW_LIMIT.toString());
    const SelectProperties =
      this.getAttribute('select-properties')?.split(',') ?? this.DEFAULT_SELECTED_PROPERTIES;
    const SourceId = this.getAttribute('source-id') ?? this.DEFAULT_SOURCE_ID;
    const SortDirection = this.getAttribute('sort-direction') ?? undefined;
    const SortProperty = this.getAttribute('sort-property') ?? undefined;
    const UseAudienceTargeting = this.getAttribute('use-audience-target') === 'true';

    const templateElement = this.querySelector('template');

    if (!QueryTemplate || !templateElement || !this.shadowRoot) {
      return;
    }

    const hbs = templateElement.innerHTML.replaceAll('\\{', '{');

    const Handlebars = await import(
      /* webpackChunkName: 'search-extensibility-handlebars' */ 'handlebars'
    );
    const template = Handlebars.compile(hbs);

    const results = await this.fetchSearchResults({
      QueryTemplate,
      RowLimit,
      SelectProperties,
      SourceId,
      SortDirection,
      SortProperty,
      UseAudienceTargeting,
    });

    const renderedHtml = template({ results });
    this.shadowRoot.innerHTML = renderedHtml;
  }

  private async fetchSearchResults({
    QueryTemplate,
    RowLimit,
    SelectProperties,
    SourceId,
    SortDirection,
    SortProperty,
    UseAudienceTargeting = false,
  }: {
    QueryTemplate: string;
    RowLimit: number;
    SelectProperties: string[];
    SourceId: string;
    SortDirection?: string;
    SortProperty?: string;
    UseAudienceTargeting?: boolean;
  }) {
    const spHttpClient = this._serviceScope.consume(SPHttpClient.serviceKey);
    const pageContext = this._serviceScope.consume(PageContext.serviceKey);

    const body: any = {
      request: {
        QueryTemplate,
        ClientType: 'SearchWebComponent',
        TrimDuplicates: false,
        SelectProperties: {
          results: SelectProperties,
        },
        RowLimit,
        SourceId,
        SortList: undefined,
      },
    };

    if (SortDirection && SortProperty) {
      body.request.SortList = {
        results: [{ Direction: SortDirection, Property: SortProperty }],
      };
    }

    if (UseAudienceTargeting) {
      body.request.QueryTemplate +=
        ' AND (ModernAudienceAadObjectIds:{User.Audiences} OR NOT IsAudienceTargeted:true)';
    }

    body.request.QueryTemplate = await this.replaceTokens(body.request.QueryTemplate);

    const response = await spHttpClient.post(
      `${pageContext.web.serverRelativeUrl}/_api/search/postquery`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'odata-version': '3.0',
          accept: 'application/json;odata=nometadata',
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.PrimaryQueryResult.RelevantResults.Table.Rows.map(this.transformResults);
  }

  private transformResults(row: any) {
    const result: any = {};

    row.Cells.forEach((cell: any) => {
      result[cell.Key] = cell.Value;
    });

    return result;
  }

  /**
   * @see https://microsoft-search.github.io/pnp-modern-search/usage/search-results/tokens/
   * @see https://github.com/microsoft-search/pnp-modern-search/blob/main/search-parts/src/services/tokenService/TokenService.ts
   * @param queryTemplate
   * @returns
   */
  private async replaceTokens(queryTemplate: string) {
    const pageContext = this._serviceScope.consume(PageContext.serviceKey);

    // Remove search terms, which would be common if copying directly from a search results web part
    queryTemplate = queryTemplate.replace(/\{searchTerms\}/gi, '');
    queryTemplate = queryTemplate.replace(/\{inputQueryText\}/gi, '');

    queryTemplate = queryTemplate.replace(
      /\{TenantUrl\}\/?/gi,
      pageContext.legacyPageContext.portalUrl,
    );

    // Current hub
    queryTemplate = queryTemplate.replace(
      /\{Hub.HubSiteId\}/gi,
      pageContext.legacyPageContext.hubSiteId,
    );

    // Current date
    queryTemplate = queryTemplate.replace(/\{Today\}/gi, new Date().toISOString().split('T')[0]);

    // Replace manually escaped curly braces
    queryTemplate = queryTemplate.replace(/\\({|})/gi, '$1');

    return queryTemplate;
  }
}
````
