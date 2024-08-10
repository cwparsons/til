---
title: Building a Sitecore personalization rule with multiple options
description: Basic instructions on building a Sitecore personalization rule.
pubDate: 2024-08-08
tags: ['sitecore']
---

1. Create a new Condition that inherits `StringOperatorCondition`.

   ```csharp
   using Sitecore.Diagnostics;
   using Sitecore.Rules;
   using Sitecore.Rules.Conditions;
   using System;

   namespace Customer.Feature.FeatureName.Rules.Conditions
   {
     public class NewCondition<T> : StringOperatorCondition<T> where T : RuleContext
     {
       public string Value { get; set; }

       protected override bool Execute(T ruleContext)
       {
         Assert.ArgumentNotNull(ruleContext, "ruleContext");

         // Logic that determines whether the rule applies.

         return true;
       }
     }
   }
   ```

2. Create a new _Condition_ under

   ```text
   /sitecore/system/Settings/Rules/Definitions/Elements
   ```

3. Create a folder underneath the _Condition_ to contain the option types.

4. Create items of _Standard Template_ to represent each option type. Leverage the name within your logic and set the display name to something helpful for the author.

5. Set the _Text_ of the condition to:

   ```text
   where the (context) has any [Value,TreeList,root=/sitecore/system/Settings/Rules/Definitions/Elements/Options&&selection={1930BBEB-7805-471A-A3BE-4858AC7CF696}, the list]
   ```

6. Set the _Type_ of the condition to:

   ```text
   Customer.Feature.FeatureName.Rules.Conditions.NewCondition, Customer.Feature.FeatureName
   ```
