---
title: Power Apps people picker
description: A reusable people picker in Power Apps using YAML that is styled to look like a modern control.
pubDate: 2024-08-28
tags: ['power-platform']
---

This people picker is inspired by posts like [How to Create a People Picker in Power Apps](https://www.tekki-gurus.com/how-to-create-people-picker-power-apps/). If you have the ability to use the [PeoplePicker control](https://learn.microsoft.com/en-us/power-platform/guidance/creator-kit/peoplepicker) from the [Creator Kit](https://learn.microsoft.com/en-us/power-platform/guidance/creator-kit/overview), use that instead.

This control requires using the `Office365Users` connector, and is styled to look like a modern combobox (while is actually a classic combobox). Using a modern combobox is not possible, due to the items not appearing during the search experience.

```yaml
- cb_PeoplePicker:
    Control: Classic/ComboBox
    Properties:
      AccessibleLabel: ="People picker"
      DisplayFields: =["DisplayName","Mail"]
      InputTextPlaceholder: ="Search for a person"
      Items: |-
        =Office365Users.SearchUserV2({searchTerm: Trim(Self.SearchText), isSearchTermRequired: true}).value
      SearchFields: =["DisplayName","Mail"]
      BorderColor: =Color.Transparent
      BorderThickness: =0
      ChevronBackground: =
      ChevronFill: =RGBA(97, 97, 97, 1)
      ChevronHoverBackground: =Self.ChevronBackground
      ChevronHoverFill: =RGBA(79, 90, 94, 1)
      Fill: =RGBA(245, 245, 245, 1)
      Height: =32
      HoverBorderColor: =Self.ChevronBackground
      PressedColor: =RGBA(0, 0, 0, 1)
      SelectionColor: =RGBA(0, 0, 0, 255)
      SelectionFill: =
      SelectionTagColor: =RGBA(0, 0, 0, 255)
      SelectionTagFill: =
      Size: =11
      Width: =Parent.Width
```
