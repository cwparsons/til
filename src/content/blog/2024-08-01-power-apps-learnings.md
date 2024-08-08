---
title: 'Power Apps learnings'
description: A list of stuff learned around using Microsoft's Power Apps.
pubDate: 2024-08-01
tags: ['power-apps']
---

**Project Evolution:** During my first project with Power Apps (May - August 2024), there were significant updates and new components introduced. This necessitated revisiting and updating existing components to leverage improved features.

**Naming Conventions:** The client adhered to specific naming conventions for layers, aligning with the guidelines in [2024 Power Apps Coding Standards For Canvas Apps](https://www.matthewdevaney.com/power-apps-coding-standards-for-canvas-apps/).

**Consistent Spacing:** Utilizing vertical and horizontal containers is crucial for maintaining consistent spacing throughout your app.

**HTML Text Components:** While HTML text components may seem unconventional, they are essential in scenarios where vertical and horizontal containers cannot achieve the desired width or flex options, similar to web apps. They also support auto height.

**SharePoint Limitations:** If a SharePoint list contains more than 12 lookup columns, it cannot be used directly within a Power App. Alternatives include creating a Power Automate flow to retrieve and return content or using the [Office 365 Group connector to make Graph calls](https://www.menzel.it/post/2023/08/powerappssearchgraphapi/). The latter option could have saved time, as I initially created multiple flows for this purpose.

**Data Transformation:** When building Power Apps that connect to Flows for data retrieval, I found it more efficient to handle all data transformations within Power Apps. The flow would simply retrieve data and return it without additional transformations.

**Permissions Challenges:** Collaborating on the same app or flow can lead to permissions issues. Problems arise if the app is owned by one person and the flow or its connections are owned by another.

**Flow Stability:** Many flows would randomly break, necessitating a refresh within the Power App.

**YAML Code Duplication:** The ability to copy and paste YAML code within Power Apps, introduced during development, is extremely useful for duplicating fields. Copying and pasting layers appends a `_{number}` to the layer, which does not conform to naming conventions. Instead, copying YAML allows for find-and-replace adjustments before pasting the code back in. However, this can sometimes disrupt styling, requiring the removal of box shadows.

**Component Borders:** Adding lines or borders between components is not always straightforward, often necessitating the use of 1px rectangles.

**Interactivity:** There's no way to handle enter presses on form inputs. There is very limited hover or focus state styling.

**Contextual Information:** All my Power Apps required contextual information, which was handled by passing query string parameters using named formulas.

```
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

**Error handling:** Every external call should be wrapped with `IfError`, along with `Notify` to show error messaging.

```
IfError(
    Set(
        gblDocument,
        LookUp(
            'Document Library',
            And(
                'Document Id' = Value(fxUrlParameters.ListItemId),
                'Document revision' = gblDocumentRevision
            )
        )
    ),
    // On failure
    Notify(
        $"Sorry, something went wrong trying to pre-populate data. Please try again.",
        NotificationType.Error
    );
    Notify(
        FirstError.Message,
        NotificationType.Error
    )
);
```

## Related links

- [Matthew Devaney's blog](https://www.matthewdevaney.com/) is essential reading. I read every Power App post. Some notable pieces:
  - [2024 Power Apps Coding Standards For Canvas Apps](https://www.matthewdevaney.com/power-apps-coding-standards-for-canvas-apps/)
  - [6 Use-Cases For The Power Apps App Formulas Property (Named Formulas)](https://www.matthewdevaney.com/6-use-cases-for-the-power-apps-app-formulas-property-named-formulas/)
  - [Disable The Power Apps Permissions Pop-Up (Bypass Consent Form)](https://www.matthewdevaney.com/disable-the-power-apps-permissions-pop-up-bypass-consent-form/)
  - [Power Apps People Picker Delegation Workaround](https://www.matthewdevaney.com/power-apps-people-picker-delegation-workaround/)
