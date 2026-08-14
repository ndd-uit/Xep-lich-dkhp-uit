import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { tracker } from '../..';
import { getTongSoTcJudgement } from '../../utils';
import { selectTongSoTcSelected, useTkbStore } from '../../zus';

function SoTinChi(props: { tongSoTcSelected?: number }) {
  const tongSoTcSelectedB2 = useTkbStore(selectTongSoTcSelected);
  const tongSoTcSelected = props.tongSoTcSelected ?? tongSoTcSelectedB2;
  const judgement = getTongSoTcJudgement(tongSoTcSelected);

  return (
    <Tooltip title={judgement.text}>
      <Chip
        color={judgement.isOk ? 'success' : 'error'}
        variant="outlined"
        label={
          <>
            Số tín chỉ: <b>{tongSoTcSelected}</b>
          </>
        }
        sx={{
          height: 34,
          borderRadius: 2,
          bgcolor: judgement.isOk ? 'success.light' : 'error.light',
          fontWeight: 500,
          '& .MuiChip-label': { px: 1.5 },
        }}
        onMouseEnter={() => {
          tracker.track('[so_tc] label_hovered', {
            tongSoTc: tongSoTcSelected,
            ...judgement,
          });
        }}
      />
    </Tooltip>
  );
}

export default SoTinChi;
