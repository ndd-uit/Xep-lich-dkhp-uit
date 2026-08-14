import MenuIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { IconButton } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { default as MuiDrawer } from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/styles';
import makeStyles from '@mui/styles/makeStyles';
import logoUit from 'assets/img/logo-uit.png';
import clsx from 'clsx';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { tracker } from '../../..';
import { ROUTES } from '../../../constants';
import { useDrawerStore } from '../../../zus';

const drawerWidth = 224;
const drawerWidthClosed = 56;

const openCloseMixin = (theme: Theme) =>
  ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  } as const);

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...openCloseMixin(theme),
  '& .MuiDrawer-paper': {
    background: '#ffffff',
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: '6px 0 28px rgba(44, 78, 96, 0.06)',
    ...openCloseMixin(theme),
    width: open ? drawerWidth : drawerWidthClosed,
  },
}));

function LeftDrawer() {
  const classes = useStyles();
  const toggleDrawer = useDrawerStore((s) => s.toggleDrawer);
  const isOpen = useDrawerStore((s) => s.isDrawerOpen);
  const isCollapsed = !isOpen;
  const location = useLocation();
  const history = useHistory();

  useHotkeys(['shift+`', 'alt+`'], () => toggleDrawer());
  useHotkeys(['shift+1', 'alt+1'], () => history.push(ROUTES._1ChonFileExcel.path));
  useHotkeys(['shift+2', 'alt+2'], () => history.push(ROUTES._2XepLop.path));
  useHotkeys(['shift+3', 'alt+3'], () => history.push(ROUTES._3KetQua.path));

  return (
    <nav className={classes.drawer}>
      <Drawer className={clsx(classes.drawer)} variant="permanent" open={isOpen}>
        <Box className={classes.drawerTopCollapse}>
          <Tooltip title={isOpen ? 'Collapse' : 'Expand'}>
            <IconButton color="inherit" onClick={toggleDrawer} size="large">
              <MenuIcon className={clsx(classes.collapseIcon, isCollapsed && classes.collapseIconCollapsed)} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Logo */}
        <Box className={classes.brand}>
          <Tooltip title="Tool đăng ký học phần UIT">
            <img
              src={logoUit}
              alt="Đại học Công nghệ Thông tin"
              className={clsx(classes.img, 'drop-shadow-blue', isCollapsed && classes.imgCollapsed)}
            />
          </Tooltip>
        </Box>

        {/* List item */}
        <List className={classes.menuList}>
          {Object.values(ROUTES).map((route, index) => (
            <ListItem
              key={route.path}
              className={classes.listItem}
              button
              component={NavLink}
              to={route.path + location.search}
              activeClassName={classes.menuItemActive}
              onClick={() => {
                tracker.track('[drawer] menu_item_clicked', route);
              }}
            >
              <ListItemText primary={isOpen ? route.name : `${index + 1}.`} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </nav>
  );
}

export default LeftDrawer;

// styles below:

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    transition: 'width 0.24s ease',
  },
  collapseIcon: {
    margin: '0 auto 0',
    transform: 'rotate(0deg)',
    transition: 'transform 0.24s ease',
  },
  collapseIconCollapsed: {
    transform: 'rotate(180deg)',
  },
  brand: {
    height: 112,
    margin: theme.spacing(2, 3, 1),
    display: 'grid',
    placeItems: 'center',
  },
  img: {
    width: '100%',
    maxWidth: 148,
    transformOrigin: 'center',
    transform: 'scale(1)',
    transition: 'transform 0.24s ease, filter 0.2s ease',
  },
  imgCollapsed: {
    transform: 'scale(0)',
  },
  drawerTopCollapse: {
    minHeight: 56,
    background: '#f7fafb',
    color: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'grid',
    placeItems: 'center',
  },
  menuList: {
    paddingTop: theme.spacing(1),
  },
  listItem: {
    borderLeft: '3px solid transparent',
    borderRadius: 10,
    userSelect: 'none',
    userDrag: 'none',
    margin: '6px 10px',
    paddingTop: 10,
    paddingBottom: 10,
    width: 'auto',
    color: theme.palette.text.secondary,
    transition: 'background-color 160ms ease, color 160ms ease, transform 120ms ease',
    '&:hover': {
      backgroundColor: '#f0f6f8',
      color: theme.palette.text.primary,
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
    '& .MuiListItemText-primary': {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  menuItemActive: {
    background: '#e3f1f6',
    color: theme.palette.primary.main,
    borderLeftColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: '#dcecf2',
      color: theme.palette.primary.dark,
    },
    '& .MuiListItemText-primary': {
      fontWeight: 800,
    },
  },
}));
