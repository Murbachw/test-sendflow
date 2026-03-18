import { Tab, Tabs, Typography } from '@mui/material'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'

import type { Connection } from '../types/firestore'
import type { TabValue } from '../app/types'

type WorkspaceTabsProps = {
  selectedConnection: Connection | null
  tab: TabValue
  onTabChange: (value: TabValue) => void
}

export const WorkspaceTabs = ({ onTabChange, selectedConnection, tab }: WorkspaceTabsProps) => (
  <div className="mb-6 rounded-[34px] border border-white/70 bg-white/72 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur">
    <div className="mb-5 flex flex-col gap-4 px-3 pt-2 md:flex-row md:items-end md:justify-between">
      <div>
        <Typography className="tracking-[0.18em] uppercase text-cyan-700" variant="caption">
          Workspace
        </Typography>
        <Typography className="mt-1 text-slate-900" variant="h4">
          Operacao centralizada
        </Typography>
      </div>
      <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
        {selectedConnection ? `Conexao ativa: ${selectedConnection.name}` : 'Selecione ou crie uma conexao'}
      </div>
    </div>
    <Tabs
      onChange={(_, value: TabValue) => onTabChange(value)}
      sx={{
        '& .MuiTabs-indicator': { display: 'none' },
        '& .MuiTab-root': { color: '#475569' },
        '& .MuiTab-root.Mui-selected': {
          background: 'linear-gradient(135deg, #0f172a 0%, #155e75 100%)',
          color: '#ffffff',
        },
        '& .MuiTab-root.Mui-selected .MuiSvgIcon-root': {
          color: '#ffffff',
        },
      }}
      value={tab}
      variant="scrollable"
    >
      <Tab icon={<HubOutlinedIcon />} iconPosition="start" label="Conexoes" value="connections" />
      <Tab icon={<PeopleAltOutlinedIcon />} iconPosition="start" label="Contatos" value="contacts" />
      <Tab icon={<MessageOutlinedIcon />} iconPosition="start" label="Mensagens" value="messages" />
    </Tabs>
  </div>
)
