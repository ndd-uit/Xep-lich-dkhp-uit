import ShareIcon from '@mui/icons-material/Share';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import type { InputBaseProps, Theme } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { forwardRef, useMemo } from 'react';
import type { HTMLAttributes } from 'react';
import { tracker } from '../..';
import { extractListMaLop } from '../../utils';
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
                    const newUrl = window.location.origin + window.location.pathname + '?self_selected=' + value;
                    navigator.clipboard.writeText(newUrl);
                    window.open(newUrl, Math.random()?.toString());
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
