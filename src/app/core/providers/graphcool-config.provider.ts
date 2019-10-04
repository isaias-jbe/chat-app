import { InjectionToken } from '@angular/core';

/**
 * Esta inface será fornecida para outros modulos atravez de
 * injeção de dependencias pois, não é possivel fornecer uma interface
 * para injeção de depencias porque em tempo d eexecução essa interface
 * não vai mais existir.
 */

// ID da aplicação Graphcoll
const graphcoolId = 'ck0k5hxsp3i8t0127meqvs7qr';

export interface GraphcoolConfig {
  // Simple
  simpleAPI: string;
  // Subscriptions
  subscriptionsAPI: string;
  // File
  fileAPI: string;
  // Relay
  fileDownloadURL: string;
}

export const graphcoolConfig: GraphcoolConfig = {
  simpleAPI: `https://api.graph.cool/simple/v1/${graphcoolId}`,
  subscriptionsAPI: `wss://subscriptions.graph.cool/v1/${graphcoolId}`,
  fileAPI: `https://api.graph.cool/file/v1/${graphcoolId}`,
  fileDownloadURL: `https://files.graph.cool/${graphcoolId}`
};

/**
 * O injectionToken consegue trabalhar com tipos genéricos.
 * O InjetionToken previne a injeção de dependencia.
 */
export const GRAPHCOOL_CONFIG = new InjectionToken<GraphcoolConfig>(
  'graphcool.config',
  {
    providedIn: 'root',
    factory: () => {
      return graphcoolConfig;
    }
  }
);
