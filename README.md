# adapt-contrib-accordion-audio

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/accordion01.gif" alt="accordion in action" align="right">  **Accordion Audio** is a *presentation component* bundled with the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  

The component displays a vertically stacked list of headings. Each heading is associated with a collapsible content panel. Clicking a heading toggles the visibility of its content panel. Content panels may contain text and/or an image.

## Installation

Accordion audio must be manually installed in the adapt framework and authoring tool.

If **Accordion Audio** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).  
<div float align=right><a href="#top">Back to Top</a></div>

## Settings Overview

The attributes listed below are used in *components.json* to configure **Accordion audio**, and are properly formatted as JSON in [*example.json*](https://github.com/deltanet/adapt-contrib-accordion-audio/blob/master/example.json).

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**_component** (string): This value must be: `accordion-audio`.

**_classes** (string): CSS class name to be applied to **Accordion Audio**’s containing div. The class must be predefined in one of the Less files. Separate multiple classes with a space. A predefined CSS class can be applied to an Accordion Item.

**_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.  

**instruction** (string): This optional text appears above the component. It is frequently used to
guide the learner’s interaction with the component.  

**_items** (array): Multiple items may be created. Each _item_ represents one element of the accordion and contains values for **title**, **body**, and **_graphic**.  

>**title** (string): This text is displayed as the element's header. It is displayed at all times, even when the **body** has been collapsed.

>**body** (string): This content will be displayed when the learner opens this accordion element. It may contain HTML.  

>**_graphic** (object): An optional image which is displayed below the item body when the learner opens this accordion element. It contains values for **src** and **alt**.

>>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *course/en/images/c-45-1.jpg*).

>>**alt** (string): This text becomes the image’s `alt` attribute.

>>**attribution** (string): Optional text to be displayed as an [attribution](https://wiki.creativecommons.org/Best_practices_for_attribution). By default it is displayed below the image. Adjust positioning by modifying CSS. Text can contain HTML tags, e.g., `Copyright © 2015 by <b>Lukasz 'Severiaan' Grela</b>`.

>**_classes** (string): An optional class that will be applied to the Accordion Item.

**_shouldCollapseItems** (boolean): Used to control the auto-collapse of other expanded Accordion items whenever an item is clicked/expanded. Defaulted to 'true'

**_setCompletionOn** (string): Determines when the component registers as complete. Acceptable values are `"allItems"` and `"inview"`. `"allItems"` (the default) requires the learner to view every single accordion item; `"inview"` requires only that the component has been viewed (i.e. passed completely through the browser viewport).

### Accessibility

**Accordion Audio** has been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **ariaRegion**. This label is not a visible element. It is utilized by assistive technology such as screen readers. Should the region's text need to be customised, it can be found within the **globals** object in [*properties.schema*](https://github.com/deltanet/adapt-contrib-accordion-audio/blob/master/properties.schema).   
<div float align=right><a href="#top">Back to Top</a></div>

## Limitations

Body graphics are displayed only when `"layout": "full"`. On a mobile device, a fully spanned **Accordion Audio** will be reduced to single-width. At this smaller size the graphic will not be displayed.  

----------------------------
**Version number:**  3.0.2  
**Framework versions:** 3.3+  
**Author / maintainer:** DeltaNet (Forked from Adapt Core Team)  
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE 11, IE Mobile 11, Safari 11+12 for macOS+iOS, Opera    
**Authoring tool support:** yes
