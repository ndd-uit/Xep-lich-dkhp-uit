import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import ImageIcon from '@mui/icons-material/Image';
import { useMemo, useState } from 'react';
import { ROUTES } from '../../../constants';
import { getDanhSachTiet } from '../../../utils';
import { selectIsChiVeTkb, useTkbStore } from '../../../zus';
import ErrorBoundary from '../ErrorBoundary';
import ClassCell, { ClassCellContext } from './ClassCell';
import TableHead from './TableHead';
import {
  CELL,
  PhanLoaiHocTrenTruongContext,
  type RowData,
  usePhanLoaiHocTrenTruongContext,
  useProcessImageTkb,
} from './hooks';
import './styles.css';
import { timeLookup, tietOnline } from './utils';

const GetCell = ({ data }: { data: RowData[keyof RowData] }) => {
  if (data === CELL.NO_CLASS) return <td />;
  if (data === CELL.OCCUPIED) return null;
  return <ClassCell data={data} rowSpan={getDanhSachTiet(data.Tiet).length} />;
};

function RowHocTrenTruong({ row, index }: { row: RowData; index: number }) {
  const shouldBeHidden = useMemo(() => {
    if (index < 10) return false; // Tiết 1-10 luôn luôn hiện,
    return Object.values(row).every((cell) => cell === CELL.NO_CLASS); // Tiết buổi tối + Online nếu không có lớp thì ẩn đi
  }, [row, index]);

  return (
    <tr style={{ visibility: shouldBeHidden ? 'collapse' : undefined }}>
      <td className="cell-tiet">
        Tiết {index === tietOnline.index ? tietOnline.stringValue : index + 1} <br />
        {timeLookup[index]}
      </td>
      {(['Thu2', 'Thu3', 'Thu4', 'Thu5', 'Thu6', 'Thu7'] as const).map((dayKey) => (
        <GetCell key={dayKey} data={row[dayKey]} />
      ))}
    </tr>
  );
}

function Render() {
  const { rowDataHocTrenTruong, khongHocTrenTruong, redundant } = usePhanLoaiHocTrenTruongContext();

  const location = useLocation();
  const isChiVeTkb = useTkbStore(selectIsChiVeTkb);
  const { tkbTableRef, isProcessingImage, saveTkbImageToComputer, copyTkbImageToClipboard } = useProcessImageTkb();

  const isInStep2 = location.pathname === ROUTES._2XepLop.path;

  const [areExtraButtonsShown, setAreExtraButtonsShown] = useState(false);
  const redundantClasses = useMemo(() => redundant.flatMap((item) => item.new), [redundant]);

  // TODO: refactor the messy flow after writing tests
  if (isInStep2 && isChiVeTkb) {
    return (
      <h3 style={{ textAlign: 'center', padding: 20 }}>
        {location.search.includes('self_selected') ? (
          <>
            Preview bị disable ở chế độ chia sẻ TKB <code style={{ whiteSpace: 'nowrap' }}>?self_selected=</code>, sang
            tab Bước 3 để xem TKB
          </>
        ) : (
          `Bạn đang chọn "Tự chuẩn bị danh sách mã lớp" ở tab Bước 3`
        )}
      </h3>
    );
  }

  return (
    <ClassCellContext>
      <div
        id="thoi-khoa-bieu"
        className={clsx({ compact: isInStep2 })}
        onMouseEnter={() => setAreExtraButtonsShown(true)}
        onMouseLeave={() => setAreExtraButtonsShown(false)}
      >
        <div className={clsx('extra-buttons', { 'extra-buttons-shown': areExtraButtonsShown })}>
          <Tooltip title="Tải hình ảnh TKB về máy" placement="left">
            <IconButton
              aria-label="Tải ảnh thời khóa biểu"
              disabled={isProcessingImage}
              onClick={saveTkbImageToComputer}
              color="primary"
            >
              {isProcessingImage ? <CircularProgress color="inherit" size={22} /> : <FileDownloadIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Sao chép hình ảnh TKB vào clipboard" placement="left">
            <IconButton
              aria-label="Sao chép ảnh thời khóa biểu"
              disabled={isProcessingImage}
              onClick={copyTkbImageToClipboard}
              color="primary"
            >
              <ImageIcon />
            </IconButton>
          </Tooltip>
        </div>

        {redundantClasses.length > 0 && (
          <table className="redundant-classes-table">
            <tbody>
              {redundantClasses.map((lop) => (
                <tr key={`${lop.MaLop}-${lop.Thu}-${lop.Tiet}`}>
                  <ClassCell data={lop} isOutsideTable />
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <table ref={tkbTableRef}>
          <TableHead />
          <tbody>
            {rowDataHocTrenTruong.map((row, index) => (
              <RowHocTrenTruong key={index} row={row} index={index} />
            ))}
            {khongHocTrenTruong.map((lop, index) => (
              <tr key={index}>
                <ClassCell colSpan={7} data={lop} isOutsideTable />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClassCellContext>
  );
}

function Index() {
  return (
    <ErrorBoundary>
      <PhanLoaiHocTrenTruongContext>
        <Render />
      </PhanLoaiHocTrenTruongContext>
    </ErrorBoundary>
  );
}

export default Index;
