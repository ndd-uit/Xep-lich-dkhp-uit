import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { tracker } from '../..';
import SoTinChi from '../components/SoTinChi';
import ThoiKhoaBieuTable from '../components/ThoiKhoaBieuTable';
import { selectIsChiVeTkb, selectTongSoTcBuoc3, useTkbStore } from '../../zus';
import DanhSachLopInput from './DanhSachLopInput';

function Index() {
  const setIsChiVeTkb = useTkbStore((s) => s.setIsChiVeTkb);
  const khongXepLop = useTkbStore(selectIsChiVeTkb);
  const tongSoTC = useTkbStore(selectTongSoTcBuoc3);

  const TABLE_EXTRA_BUTTONS_WIDTH = 30;
  return (
    <Box sx={{ maxWidth: 1500, width: '100%', py: { xs: 1, sm: 2 } }}>
      <Box component="header" sx={{ mb: 2.5 }}>
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, mb: 0.75 }}>
          Bước 3
        </Typography>
        <Typography component="h1" variant="h5" sx={{ mb: 0.75 }}>
          Thời khóa biểu đã chọn
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Kiểm tra lại danh sách lớp và các ca học trước khi đăng ký học phần.
        </Typography>
      </Box>

      <Paper component="section" variant="outlined" sx={{ p: { xs: 1.5, sm: 2.25 }, mb: 2.5 }}>
        <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Tooltip
            title={
              window.location.search.includes('self_selected')
                ? 'Đang dùng tính năng chia sẻ TKB ?self_selected='
                : 'Tick chọn khi bạn không dùng chức năng Xếp Lớp ở Bước 2 và nhập danh sách lớp tự chuẩn bị'
            }
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={khongXepLop}
                  onChange={(e) => {
                    setIsChiVeTkb(e.target.checked);
                    tracker.track('[page3] checkbox_chi_ve_tkb_toggled', {
                      newState: e.target.checked,
                    });
                  }}
                  name="chiVeTkb"
                  color="primary"
                  size="small"
                />
              }
              sx={{ m: 0, opacity: khongXepLop ? 1 : 0.62 }}
              label={'Tự chuẩn bị danh sách mã lớp'}
            />
          </Tooltip>
          <SoTinChi tongSoTcSelected={tongSoTC} />
        </Grid>
        <Grid container spacing={2} sx={{ mt: 0.25 }}>
          <DanhSachLopInput />
        </Grid>
      </Paper>

      <Box sx={{ pr: `${TABLE_EXTRA_BUTTONS_WIDTH}px` }}>
        <ThoiKhoaBieuTable />
      </Box>
    </Box>
  );
}

export default Index;
