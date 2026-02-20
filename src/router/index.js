import { createRouter, createWebHashHistory } from 'vue-router';
import StartMenuView from '../views/StartMenuView.vue';
import WorldMapView from '../views/WorldMapView.vue';
import PortView from '../views/PortView.vue';
import OfficeView from '../views/OfficeView.vue';
import VoyageSummaryView from '../views/VoyageSummaryView.vue';
import CargoView from '../views/CargoView.vue';
import ShipBrokerView from '../views/ShipBrokerView.vue';
import DockingView from '../views/DockingView.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'start', component: StartMenuView },
    { path: '/world', name: 'world', component: WorldMapView },
    { path: '/port', name: 'port', component: PortView },
    { path: '/office', name: 'office', component: OfficeView },
    { path: '/voyage', name: 'voyage', component: VoyageSummaryView },
    { path: '/cargo', name: 'cargo', component: CargoView },
    { path: '/broker', name: 'broker', component: ShipBrokerView },
    { path: '/docking', name: 'docking', component: DockingView },
  ],
});
