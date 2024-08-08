---
title: 'sp-theme-provider'
description: 'A React provider and hook for getting SharePoint theme values.'
pubDate: 2021-04-16
tags: ['spfx']
---

A React provider and hook for getting SharePoint theme values.

````typescript
/**
 * Create a SharePoint theme context provider, allowing children components to
 * use the SharePoint theme and update when the theme changes.
 *
 * Usage:
 * ```typescript
 * <SpThemeProvider observer={this} serviceScope={this.context.serviceScope}>
 *     {children}
 * </SpThemeProvider>
 * ```
 *
 * ```typescript
 * const theme = useTheme();
 * ```
 */

import { IReadonlyTheme, ThemeProvider, ThemeChangedEventArgs } from '@microsoft/sp-component-base';
import { ISPEventObserver, ServiceScope } from '@microsoft/sp-core-library';
import { isEqual } from '@microsoft/sp-lodash-subset';
import { createContext, createElement, useContext, useEffect, useRef, useState } from 'react';

/**
 * Create the React context for storing the SharePoint theme.
 */
export const SpThemeContext = createContext<IReadonlyTheme>(undefined);

type SpThemeProviderProps = {
  children?: React.ReactNode;
  observer?: ISPEventObserver;
  serviceScope: ServiceScope;
};

/**
 * Create the provider element that gets the SharePoint theme from the
 * ThemeProvider, and handles changes to the theme using React state.
 */
export const SpThemeProvider = ({ children, observer, serviceScope }: SpThemeProviderProps) => {
  // Use a ref to lazy load the ThemeProvider service.
  const themeProviderRef = useRef<ThemeProvider>(null);

  // Only load the ThemeProvider service once.
  if (themeProviderRef.current === null) {
    themeProviderRef.current = serviceScope.consume(ThemeProvider.serviceKey);
  }

  // Use a function to only get the theme once.
  const [theme, setTheme] = useState<IReadonlyTheme>(() => themeProviderRef.current.tryGetTheme());

  // Add events to handle changes to the theme.
  useEffect(() => {
    if (!observer) {
      return;
    }

    const themeChangeCallback = (themeChangeEventArgs: ThemeChangedEventArgs) => {
      // Only change the state if the theme is different.
      if (!isEqual(theme, themeChangeEventArgs.theme)) {
        setTheme(themeChangeEventArgs.theme);
      }
    };

    themeProviderRef.current.themeChangedEvent.add(observer, themeChangeCallback);

    return () => {
      themeProviderRef.current.themeChangedEvent.remove(observer, themeChangeCallback);
    };
  }, [theme]);

  return createElement(SpThemeContext.Provider, {
    children,
    value: theme,
  });
};

SpThemeProvider.displayName = 'SpThemeProvider';

export const SpThemeConsumer = SpThemeContext.Consumer;

export const useTheme = () => {
  return useContext(SpThemeContext);
};
````
