import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HeaderComponent} from './header/header.component';
import {BodyComponent} from './body/body.component';
import {FooterComponent} from './footer/footer.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {GeneralComponent} from './body/general/general.component';
import {NewsComponent} from './body/news/news.component';
import {AlertsComponent} from './body/alerts/alerts.component';
import {VoidTraderComponent} from './body/void-trader/void-trader.component';
import {SortieComponent} from './body/sortie/sortie.component';
import {InvasionsComponent} from './body/invasions/invasions.component';
import {ConclaveChallengesComponent} from './body/conclave-challenges/conclave-challenges.component';
import {FlashSalesComponent} from './body/flash-sales/flash-sales.component';
import {AlertComponent} from './body/alerts/alert/alert.component';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {WarframeService} from './warframe.service';
import {Ng2Webstorage} from 'ngx-webstorage';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// Se definen las rutas de la app. Cada una se corresponde con un componente
const routes: Routes = [
  // La ruta '' indica la ruta por defecto (antiguo index.html)
  {path: '', component: BodyComponent},
  // Cualquier otra ruta no considerada en las entradas anteriores -> ERROR
  {path: '**', component: PageNotFoundComponent}
];
export const routing = RouterModule.forRoot(routes);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BodyComponent,
    FooterComponent,
    GeneralComponent,
    NewsComponent,
    AlertsComponent,
    VoidTraderComponent,
    SortieComponent,
    InvasionsComponent,
    ConclaveChallengesComponent,
    FlashSalesComponent,
    AlertComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing,
    Ng2Webstorage,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [WarframeService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
