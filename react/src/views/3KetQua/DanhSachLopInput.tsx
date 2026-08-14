import ShareIcon from '@mui/icons-material/Share';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import type { InputBaseProps, Theme } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { enqueueSnackbar } from 'notistack';
import { forwardRef, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import { tracker } from '../..';
import { copyTextToClipboard, extractListMaLop } from '../../utils';
import { selectIsChiVeTkb, selectPhanLoaiHocTrenTruong, selectTextareaChiVeTkb, useTkbStore } from '../../zus';

const getReadonlySx = (theme: Theme) => ({
  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.action.hover,
    cursor: 'default',
  },
});

const ClassListTextarea: InputBaseProps['inputComponent'] = forwardRef<
  HTMLTextAreaElement,
  HTMLAttributes<HTMLTextAreaElement>
>((props, ref) => {
  const isManualInput = useTkbStore(selectIsChiVeTkb);
  return (
    <Tooltip title={isManualInput ? 'Mỗi mã lớp một hàng, hoặc cách nhau bằng khoảng trắng, hoặc dấu phẩy' : ''}>
      <textarea ref={ref} style={{ resize: 'vertical' }} {...props} />
    </Tooltip>
  );
});
ClassListTextarea.displayName = 'ClassListTextarea';

function useClassList() {
  const classes = useTkbStore(selectPhanLoaiHocTrenTruong);
  const classCodes = useMemo(() => extractListMaLop(classes.flat()), [classes]);
  const hasClasses = classCodes.length > 0;
  const isManualInput = useTkbStore(selectIsChiVeTkb);
  const manualInput = useTkbStore(selectTextareaChiVeTkb);

  const value = (() => {
    if (isManualInput) return manualInput;
    if (!hasClasses) return 'Chưa có lớp nào';
    return classCodes.join(',');
  })();

  return { hasClasses, isManualInput, value };
}

function DanhSachLopInput() {
  const theme = useTheme();
  const setManualInput = useTkbStore((state) => state.setTextareChiVeTkb);
  const { hasClasses, isManualInput, value } = useClassList();
  const isReadonly = !isManualInput;

  return (
    <Grid item xs={12}>
      <TextField
        label="Danh sách mã lớp"
        fullWidth
        size="small"
        multiline
        inputProps={{ readOnly: isReadonly, style: { resize: 'vertical' } }}
        rows={2}
        variant="outlined"
        onChange={(event) => {
          setManualInput(event.target.value);
        }}
        value={value}
        disabled={isReadonly && !hasClasses}
        sx={isReadonly ? getReadonlySx(theme) : undefined}
        InputProps={{
          inputComponent: ClassListTextarea,
          endAdornment:
            isReadonly && hasClasses ? (
              <Tooltip title="Chia sẻ thời khóa biểu">
                <IconButton
                  edge="end"
                  size="small"
                  aria-label="Chia sẻ thời khóa biểu"
                  onClick={() => {
                    tracker.track('[page3] btn_chia_se_tkb_clicked');
                    const shareUrl = new URL(window.location.pathname, window.location.origin);
                    shareUrl.searchParams.set('self_selected', value);
                    const shareUrlString = shareUrl.toString();

                    window.open(shareUrlString, '_blank', 'noopener,noreferrer');
                    copyTextToClipboard(shareUrlString)
                      .then(() => {
                        enqueueSnackbar('Đã sao chép liên kết chia sẻ.', { variant: 'success' });
                      })
                      .catch((error) => {
                        console.error('Không thể sao chép liên kết chia sẻ:', error);
                        enqueueSnackbar('Đã mở liên kết chia sẻ nhưng không thể sao chép vào clipboard.', {
                          variant: 'warning',
                        });
                      });
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            ) : null,
        }}
      />
    </Grid>
  );
}

export default DanhSachLopInput;
