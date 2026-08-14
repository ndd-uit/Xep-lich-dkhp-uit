import AgGrid from './AgGrid';
import TrungTkbDialog, { TrungTkbDialogContext } from './TrungTkbDialog';

function Index() {
  return (
    <div style={{ minWidth: '100%' }}>
      <TrungTkbDialogContext>
        <AgGrid />
        <TrungTkbDialog />
      </TrungTkbDialogContext>
    </div>
  );
}

export default Index;
