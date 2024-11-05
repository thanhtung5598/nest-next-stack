import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogContentText,
} from '@mui/material';
import { borrowService } from '@/data/borrow';

interface RejectDialogProps {
  open: boolean;
  onClose: () => void;
  borrowRequestId: number;
  onActionComplete: () => void;
}

const RejectDialog: React.FC<RejectDialogProps> = ({
  open,
  onClose,
  borrowRequestId,
  onActionComplete,
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    setLoading(true);
    try {
      await borrowService.borrowAction(borrowRequestId, 'reject', { rejectionReason });
      onActionComplete();
      onClose();
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reject Borrow Request</DialogTitle>
      <DialogContent>
        <DialogContentText>Please provide a reason for rejection:</DialogContentText>
        <TextField
          autoFocus
          margin="normal"
          label="Rejection Reason"
          type="text"
          fullWidth
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleReject} color="error" disabled={!rejectionReason || loading}>
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectDialog;
