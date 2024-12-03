import { Table } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.var-sao-ke.title'),
  path: '/var-sao-ke',
  description: translate('tools.var-sao-ke.description'),
  keywords: ['transaction', 'table', 'bank', 'amount', 'date', 'notes'],
  component: () => import('./var-sao-ke.vue'),
  icon: Table,
  createdAt: new Date('2023-09-06'),
});
