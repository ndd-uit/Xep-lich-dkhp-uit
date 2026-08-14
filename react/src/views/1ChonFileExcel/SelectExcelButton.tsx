import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import React, { ChangeEventHandler } from 'react';
import type { ReactNode } from 'react';
import XLSX from 'xlsx';
import { selectDataExcel, useTkbStore } from '../../zus';
import { tracker } from '../..';
import { arrayToTkbObject, getLastUpdateString, sheetJSFT, toDateTimeString } from './utils';

const Bold = ({ children }: { children: ReactNode }) => <b style={{ marginLeft: 5 }}>{children}</b>;

function SelectExcelButton() {
  const dataExcel = useTkbStore(selectDataExcel);
  const setDataExcel = useTkbStore((s) => s.setDataExcel);
  const lastUpdateString = getLastUpdateString(dataExcel);

  const handleUploadFileExcel = React.useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reportUploadFailure = (message = 'Không đúng định dạng file của trường') => {
        enqueueSnackbar(message, { variant: 'error' });
        tracker.track('[page1] upload_excel_resulted', { success: false, fileName: file.name });
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileContent = e.target?.result;
          if (!(fileContent instanceof ArrayBuffer)) throw new Error('Không đọc được nội dung file Excel.');

          const workbook = XLSX.read(fileContent, { type: 'array' });
          const theorySheet = workbook.Sheets[workbook.SheetNames[0]];
          const practiceSheet = workbook.Sheets[workbook.SheetNames[1]];
          const theoryRows = XLSX.utils.sheet_to_json<any[][]>(theorySheet, { header: 1 });
          const practiceRows = XLSX.utils.sheet_to_json<any[][]>(practiceSheet, { header: 1 });
          const rows = [...theoryRows, ...practiceRows].filter(
            (row) => typeof row[0] === 'number', // Chỉ nhận các hàng có STT dạng số.
          );

          if (!rows.length) {
            reportUploadFailure();
            return;
          }

          const now = new Date();
          setDataExcel({
            data: rows.map((array) => arrayToTkbObject(array)),
            fileName: file.name,
            lastUpdateTimestamp: now.getTime(),
            lastUpdate: toDateTimeString(now),
          });
          enqueueSnackbar(
            <>
              Upload file thành công <Bold>{file.name}</Bold>
            </>,
            {
              variant: 'success',
              action: (key) => (
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => {
                    closeSnackbar(key);
                  }}
                >
                  Đã hiểu
                </Button>
              ),
            },
          );
          tracker.track('[page1] upload_excel_resulted', { success: true, fileName: file.name });
        } catch (error) {
          console.error('Không thể đọc file Excel:', error);
          reportUploadFailure('Không thể đọc file Excel. Vui lòng kiểm tra lại file đã chọn.');
        }
      };
      reader.onerror = () => reportUploadFailure('Không thể đọc file Excel. Vui lòng thử lại.');
      reader.readAsArrayBuffer(file);
      event.target.value = '';
    },
    [setDataExcel],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'stretch', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
      }}
    >
      {/* File uploader with material-ui: https://stackoverflow.com/a/54043619/9787887*/}
      <Tooltip title={dataExcel?.fileName || 'Chưa upload file'}>
        <Button
          variant={'contained'}
          color={lastUpdateString ? 'success' : 'primary'}
          component="label"
          startIcon={<UploadFileIcon />}
          size="large"
          sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          {lastUpdateString ? (
            <>
              <span>Đã upload: </span> <Bold>{lastUpdateString}</Bold>
            </>
          ) : (
            'Upload file excel'
          )}
          <input
            type="file"
            style={{ display: 'none' }}
            accept={sheetJSFT}
            onChange={handleUploadFileExcel}
            onClick={() => {
              tracker.track('[page1] btn_upload_excel_clicked');
            }}
          />
        </Button>
      </Tooltip>
      <Box
        component="span"
        sx={{
          color: 'text.secondary',
          fontSize: '0.8125rem',
          lineHeight: 1.7,
          '& a': { fontWeight: 600 },
        }}
      >
        Cần file mẫu?{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://daa.uit.edu.vn/thong-bao-lich-dkhp-va-tkb-du-kien-hk2-nam-hoc-2023-2024"
          onClick={() => {
            tracker.track('[page1] link_excel_hk2_2023_2024_original_clicked');
          }}
        >
          chính quy HK2 2023-2024
        </a>
        : Tải{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRyf8-kMRTo4CllfPA4sjbjxkhGhR1tT7yD1HASjmClqTwwkJBgWRvuxJPIAK8Wdw/pub?output=xlsx"
          onClick={() => {
            tracker.track('[page1] link_excel_hk2_2023_2024_clicked');
          }}
        >
          TKB_dự kiến_HK2 2023-2024_29-12-2023_Copied.xlsx
        </a>{' '}
      </Box>
    </Box>
  );
}

export default SelectExcelButton;
