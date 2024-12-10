import { ToolbarButton } from '@/components/types';

export const toolbarButtons: ToolbarButton[][] = [
  [
    { id: 'grid', label: '격자', type: 'layer' },
    { id: 'fish', label: '어획량', type: 'layer' },
  ],
  [
    { id: 'current', label: '해류', type: 'streamline' },
    { id: 'sst', label: '수온', type: 'layer' },
    { id: 'wave', label: '파고', type: 'layer' },
    { id: 'ssh', label: '수위', type: 'layer' },
    { id: 'chl', label: '클로로필', type: 'layer' },
  ],
];