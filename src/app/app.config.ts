import { ApplicationConfig } from '@angular/core';

import {provideClientHydration, withHttpTransferCacheOptions} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [provideClientHydration(withHttpTransferCacheOptions({})), provideAnimationsAsync(), provideHttpClient()]
};
