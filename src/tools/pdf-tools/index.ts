import { BrandPagekit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'PDF Tools',
  path: '/pdf-tools',
  description: 'Redirect to PDF Tools site -> pdf.chitmo.com',
  keywords: ['pdf', 'tools', 'pdf management'],
  component: () => import('./pdf-tools.vue'),
  icon: BrandPagekit,
  createdAt: new Date('2024-09-05'),
});
