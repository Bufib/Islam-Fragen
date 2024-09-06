/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(elements)` | `/(elements)/` | `/(links)/about` | `/(links)/adminDashboard` | `/(links)/impressum` | `/(tabs)` | `/(tabs)/` | `/(tabs)/(elements)` | `/(tabs)/(elements)/` | `/(tabs)/(links)/about` | `/(tabs)/(links)/adminDashboard` | `/(tabs)/(links)/impressum` | `/(tabs)/about` | `/(tabs)/adminDashboard` | `/(tabs)/askQuestion` | `/(tabs)/favorites` | `/(tabs)/impressum` | `/(tabs)/news` | `/(tabs)/search` | `/(tabs)/settings` | `/_sitemap` | `/about` | `/adminDashboard` | `/askQuestion` | `/favorites` | `/impressum` | `/modal` | `/news` | `/rulesModal` | `/rulesModal/modal` | `/search` | `/settings`;
      DynamicRoutes: `/${Router.SingleRoutePart<T>}` | `/(elements)/getCategories/${Router.SingleRoutePart<T>}` | `/(elements)/getSubCategories/${Router.SingleRoutePart<T>}` | `/(tabs)/(elements)/getCategories/${Router.SingleRoutePart<T>}` | `/(tabs)/(elements)/getSubCategories/${Router.SingleRoutePart<T>}` | `/(tabs)/getCategories/${Router.SingleRoutePart<T>}` | `/(tabs)/getSubCategories/${Router.SingleRoutePart<T>}` | `/(text)/${Router.SingleRoutePart<T>}` | `/getCategories/${Router.SingleRoutePart<T>}` | `/getSubCategories/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(elements)/getCategories/[getCategories]` | `/(elements)/getSubCategories/[getSubCategories]` | `/(tabs)/(elements)/getCategories/[getCategories]` | `/(tabs)/(elements)/getSubCategories/[getSubCategories]` | `/(tabs)/getCategories/[getCategories]` | `/(tabs)/getSubCategories/[getSubCategories]` | `/(text)/[renderText]` | `/[renderText]` | `/getCategories/[getCategories]` | `/getSubCategories/[getSubCategories]`;
    }
  }
}
