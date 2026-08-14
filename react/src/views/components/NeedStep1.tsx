import UploadFileIcon from '@mui/icons-material/UploadFile';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';

function NeedStep1Warning() {
  const location = useLocation();

  return (
    <Paper
      component="section"
      variant="outlined"
      sx={{ width: '100%', maxWidth: 560, mt: { xs: 4, sm: 8 }, p: { xs: 3, sm: 5 }, textAlign: 'center' }}
    >
      <Typography component="h1" variant="h5" sx={{ mb: 1.25 }}>
        Bạn chưa chọn file Excel
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Hãy tải thời khóa biểu ở Bước 1 trước khi tiếp tục xếp lớp.
      </Typography>
      <Button
        component={RouterLink}
        to={ROUTES._1ChonFileExcel.path + location.search}
        variant="contained"
        startIcon={<UploadFileIcon />}
      >
        Chọn file Excel
      </Button>
    </Paper>
  );
}

export default NeedStep1Warning;
