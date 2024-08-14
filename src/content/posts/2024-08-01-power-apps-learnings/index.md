---
title: 'Power Apps learnings'
description: A list of stuff learned around using Microsoft's Power Apps.
pubDate: 2024-08-01
tags: ['power-platform']
---

## Project evolution

During my first project with Power Apps (May - August 2024), there were significant updates and new components introduced. This necessitated revisiting and updating existing components to leverage improved features.

## Naming conventions

The client adhered to specific naming conventions for layers, aligning with the guidelines in [2024 Power Apps Coding Standards For Canvas Apps](https://www.matthewdevaney.com/power-apps-coding-standards-for-canvas-apps/).

## Consistent spacing

Utilizing vertical and horizontal containers is crucial for maintaining consistent spacing throughout your app.

## HTML text components

While HTML text components may seem unconventional, they are essential in scenarios where vertical and horizontal containers cannot achieve the desired width or flex options, similar to web apps. They also support auto height.

## SharePoint limitations

If a SharePoint list contains more than 12 lookup columns, it cannot be used directly within a Power App. Alternatives include creating a Power Automate flow to retrieve and return content or using the [Office 365 Group connector to make Graph calls](https://www.menzel.it/post/2023/08/powerappssearchgraphapi/). The latter option could have saved time, as I initially created multiple flows for this purpose.

## Data transformation

When building Power Apps that connect to Flows for data retrieval, I found it more efficient to handle all data transformations within Power Apps. The flow would simply retrieve data and return it without additional transformations.

## Permissions challenges

Collaborating on the same app or flow can lead to permissions issues. Problems arise if the app is owned by one person and the flow or its connections are owned by another.

## Flow stability

Many flows would randomly break, necessitating a refresh within the Power App.

## YAML code copying and pasting

The ability to copy and paste YAML code within Power Apps, introduced during development, is extremely useful for duplicating fields. Copying and pasting layers appends a `_{number}` to the layer, which does not conform to naming conventions. Instead, copying YAML allows for find-and-replace adjustments before pasting the code back in. However, this can sometimes disrupt styling, requiring the removal of box shadows.

As of writing (August 2024), this feature disappeared. Hopefully it's just a bug and will return.

## Component borders

Adding lines or borders between components is not always straightforward, often necessitating the use of 1px rectangles.

## Contextual information

All my Power Apps required contextual information, which was handled by passing query string parameters using named formulas.

```powerquery
fxUrlParameters = {
    ListItemId: Param("listItemId"),
    LaunchSource: Coalesce(
        Param("launchsource"),
        "Unknown"
    ),
    DebugMode: And(
        Not(IsBlank(Param("debugmode"))),
        Lower(Param("DebugMode")) = "true"
    )
};
```

## Interactivity

There's no way to handle enter presses on form inputs. There is very limited hover or focus state styling.

## Re-usable functionality

In some cases, we may want to use the same set of functions multiple times on one screen. For example, if content needs to be fetched and refreshed after an add button or remove button click, you may need to write the same code twice. Instead, create a hidden button with the shared functionality in the `OnSelect`, and run `Select(btn)` in the areas where the function is necessary.

## Git version control (experimental)

I tried turning on Git version control in May 2024, but it forced me to authenticate every time I opened the app. When I wanted to turn it off, it did not work. I had to export and re-import the app so that the feature was disabled. I had hoped that putting everything in source control was going to be useful, but it never panned out.

## Scale to fit

Since our apps were built to be responsive, this feature was always toggled off first. Sometimes toggling it off after an app has been created will cause all sorts of weird issues.

## Related links

- [Matthew Devaney's blog](https://www.matthewdevaney.com/) is essential reading. I read every Power App post. Some notable pieces:
  - [2024 Power Apps Coding Standards For Canvas Apps](https://www.matthewdevaney.com/power-apps-coding-standards-for-canvas-apps/)
  - [6 Use-Cases For The Power Apps App Formulas Property (Named Formulas)](https://www.matthewdevaney.com/6-use-cases-for-the-power-apps-app-formulas-property-named-formulas/)
  - [Disable The Power Apps Permissions Pop-Up (Bypass Consent Form)](https://www.matthewdevaney.com/disable-the-power-apps-permissions-pop-up-bypass-consent-form/)
  - [Power Apps People Picker Delegation Workaround](https://www.matthewdevaney.com/power-apps-people-picker-delegation-workaround/)
- [Reza Dorrani's YouTube channel](https://www.youtube.com/@RezaDorrani)
- [Microsoft Power Apps - Create Apps from Figma UI Kit (Preview)](https://www.figma.com/community/file/1110934196623232680/microsoft-power-apps-create-apps-from-figma-ui-kit-preview)
- [r/PowerApps on Reddit](https://www.reddit.com/r/PowerApps/)
- [Creator kit](https://learn.microsoft.com/en-us/power-platform/guidance/creator-kit/overview)
