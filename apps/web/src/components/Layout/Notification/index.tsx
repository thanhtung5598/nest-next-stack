import { Fragment, useState } from 'react';
import {
  Avatar,
  Badge,
  badgeClasses,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  IconButtonProps,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useTheme,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PersonIcon from '@mui/icons-material/Person';
import { useNotificationSocket } from '../Websocket/useNotificationSocket';
import { formatDate } from '@/libs/functions';

type MenuButtonProps = {
  showBadge?: boolean;
} & IconButtonProps;

export default function MenuButton({ showBadge = false, ...props }: MenuButtonProps) {
  return (
    <Badge
      color="error"
      variant="dot"
      invisible={!showBadge}
      sx={{ [`& .${badgeClasses.badge}`]: { right: 3, top: 6 } }}
    >
      <IconButton size="small" {...props} />
    </Badge>
  );
}

export function Notification() {
  const { data: notifications } = useNotificationSocket();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleClickAway = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const id = open ? 'notifications-popper' : undefined;

  return (
    <Fragment>
      <MenuButton
        showBadge={notifications.length > 0}
        aria-label="Open notifications"
        aria-describedby={id}
        onClick={handleClick}
      >
        <NotificationsRoundedIcon />
      </MenuButton>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end" disablePortal>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper sx={{ minWidth: 300, maxHeight: 400, overflow: 'auto' }}>
            <Box
              sx={{
                padding: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>All Notifications</div>
              <Badge
                color="error"
                badgeContent={notifications.length}
                sx={{ cursor: 'pointer', [`& .${badgeClasses.badge}`]: { right: -3, top: 3 } }}
              >
                <NotificationsRoundedIcon />
              </Badge>
            </Box>
            <Divider />
            {notifications.length > 0 ? (
              <List
                sx={{
                  py: 0,
                }}
              >
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'light'
                            ? 'rgba(0, 0, 0, 0.08)'
                            : 'rgba(255, 255, 255, 0.12)',
                      },
                      transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={notification.user.avatarUrl || undefined}>
                        {!notification.user.avatarUrl && <PersonIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1" fontWeight="bold">
                            {notification.title}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatDate(notification.notifiedAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="textSecondary">
                          {notification.body}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ padding: 2, textAlign: 'center' }}>
                No notifications
              </Typography>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Fragment>
  );
}
