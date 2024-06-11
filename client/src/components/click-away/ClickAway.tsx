import * as React from 'react';
import Box from '@mui/material/Box';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { SxProps } from '@mui/system';

interface ClickAwayProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export default function ClickAway({ open, setOpen, children }: ClickAwayProps) {
  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const styles: SxProps = {
    position: 'absolute',
    top: 28,
    right: 0,
    left: 0,
    zIndex: 1,
    border: '1px solid',
    p: 1,
    bgcolor: 'background.paper'
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        <button type="button" onClick={handleClick}>
          Open menu dropdown
        </button>
        {open ? <Box sx={styles}>{children}</Box> : null}
      </Box>
    </ClickAwayListener>
  );
}
