import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './services/token.interceptor';
import { loggedGuard } from './services/logged.guard';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(
    withInterceptors([tokenInterceptor]),
  ),]
  
};
