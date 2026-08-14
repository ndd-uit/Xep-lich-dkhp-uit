import { Alert, AlertProps, Box, Paper, Typography } from '@mui/material';
import { selectDataExcel, useTkbStore } from '../../zus';
import SelectExcelButton from './SelectExcelButton';
import { getLastUpdateString } from './utils';

function MyAlert({ children, color, ...otherProps }: AlertProps) {
  const dataExcel = useTkbStore(selectDataExcel);
  const lastUpdateString = getLastUpdateString(dataExcel);
  const finalColor = color ?? (lastUpdateString ? 'success' : 'info');
  return (
    <Alert
      severity="info"
      color={finalColor}
      variant="outlined"
      sx={{ alignItems: 'center', fontWeight: 600, py: 0.25, '& a': { fontWeight: 800 } }}
      {...otherProps}
    >
      {children}
    </Alert>
  );
}

function Index() {
  return (
    <Box sx={{ width: '100%', maxWidth: 920, py: { xs: 1, sm: 3.5 } }}>
      <Box component="header" sx={{ mb: { xs: 2.5, sm: 4 } }}>
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 800, mb: 0.75 }}>
          Bước 1
        </Typography>
        <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
          Chuẩn bị thời khóa biểu
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
          Tải file Excel từ cổng đào tạo để bắt đầu chọn lớp và sắp xếp thời khóa biểu.
        </Typography>
      </Box>

      <Paper component="section" variant="outlined" sx={{ p: { xs: 2.25, sm: 3.5 }, mb: 3 }}>
        <Typography component="h2" variant="h6" sx={{ mb: 0.75 }}>
          Chọn file Excel
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.25 }}>
          Dùng file thời khóa biểu dự kiến gồm cả lý thuyết và thực hành.
        </Typography>
        <SelectExcelButton />
      </Paper>

      <Box component="section" aria-labelledby="notice-title">
        <Typography id="notice-title" component="h2" variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Lưu ý
        </Typography>
        <MyAlert>Chỉ tải file Excel thời khóa biểu từ cổng đào tạo UIT để dữ liệu được đọc chính xác.</MyAlert>
      </Box>
    </Box>
  );
}

export default Index;
