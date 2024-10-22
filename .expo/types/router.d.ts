/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(elements)` | `/(elements)/` | `/(links)/about` | `/(links)/adminDashboard` | `/(links)/datenschutz` | `/(links)/impressum` | `/(tabs)` | `/(tabs)/` | `/(tabs)/(elements)` | `/(tabs)/(elements)/` | `/(tabs)/(links)/about` | `/(tabs)/(links)/adminDashboard` | `/(tabs)/(links)/datenschutz` | `/(tabs)/(links)/impressum` | `/(tabs)/about` | `/(tabs)/adminDashboard` | `/(tabs)/askQuestion` | `/(tabs)/datenschutz` | `/(tabs)/favorites` | `/(tabs)/impressum` | `/(tabs)/news` | `/(tabs)/search` | `/(tabs)/settings` | `/_sitemap` | `/about` | `/adminDashboard` | `/askQuestion` | `/datenschutz` | `/favorites` | `/impressum` | `/modal` | `/news` | `/rulesModal` | `/rulesModal/modal` | `/search` | `/settings`;
      DynamicRoutes: `/${Router.SingleRoutePart<T>}` | `/(elements)/getCategories/${Router.SingleRoutePart<T>}` | `/(elements)/getSuperCategories/${Router.SingleRoutePart<T>}` | `/(tabs)/(elements)/getCategories/${Router.SingleRoutePart<T>}` | `/(tabs)/(elements)/getSuperCategories/${Router.SingleRoutePart<T>}` | `/(tabs)/getCategories/${Router.SingleRoutePart<T>}` | `/(tabs)/getSuperCategories/${Router.SingleRoutePart<T>}` | `/(text)/${Router.SingleRoutePart<T>}` | `/getCategories/${Router.SingleRoutePart<T>}` | `/getSuperCategories/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(elements)/getCategories/[getCategories]` | `/(elements)/getSuperCategories/[getSuperCategories]` | `/(tabs)/(elements)/getCategories/[getCategories]` | `/(tabs)/(elements)/getSuperCategories/[getSuperCategories]` | `/(tabs)/getCategories/[getCategories]` | `/(tabs)/getSuperCategories/[getSuperCategories]` | `/(text)/[renderText]` | `/[renderText]` | `/getCategories/[getCategories]` | `/getSuperCategories/[getSuperCategories]`;
    }
  }
}
