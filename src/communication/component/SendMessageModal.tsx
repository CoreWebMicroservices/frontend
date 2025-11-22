import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert, Button, ButtonGroup } from 'react-bootstrap';
import { AsyncSelect } from '@/common/component/dataTable/filter/AsyncSelect';
import { ModalDialog } from '@/common/component/ModalDialog';
import { searchUsers, fetchUsersByIds } from '@/user/utils/UserApi';
import { useMessagesState } from '@/communication/store/MessageState';
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/component/ApiResponseAlert';
import type { User } from '@/user/model/User';

interface SendMessageModalProps {
  show: boolean;
  onClose: () => void;
  userId?: string; // preset user
  onSent?: () => void; // callback on success
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({ show, onClose, userId, onSent }) => {
  const { sendEmailMessage, sendSmsMessage } = useMessagesState();
  const { initialErrorMessage, errors } = useMessageState();

  const [channel, setChannel] = useState<'email' | 'sms'>('email');
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [lastUserOptions, setLastUserOptions] = useState<User[]>([]);
  const [recipientEmail, setRecipientEmail] = useState('');

  // Email state
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [emailType, setEmailType] = useState<'html' | 'txt'>('txt');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');

  // SMS state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  const effectiveUserId = userId || selectedUserId;


  const validate = (): string[] => {
    const errs: string[] = [];
    if (!effectiveUserId) errs.push('User is required');
    if (channel === 'email') {
      if (!recipientEmail.trim()) errs.push('Recipient email is required');
      if (!subject.trim()) errs.push('Subject is required');
      if (!body.trim()) errs.push('Body is required');
    } else {
      if (!phoneNumber.trim()) errs.push('Phone number is required');
      if (!smsMessage.trim()) errs.push('Message text is required');
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (errs.length > 0) {
      setShowValidation(true);
      setSuccessMessage(null);
      return;
    }
    setIsSubmitting(true);
    setSuccessMessage(null);
    const result = channel === 'email'
      ? await sendEmailMessage({
        userId: effectiveUserId,
        recipient: recipientEmail,
        subject,
        body,
        emailType,
        cc: cc ? cc.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        bcc: bcc ? bcc.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      })
      : await sendSmsMessage({
        userId: effectiveUserId,
        phoneNumber,
        message: smsMessage,
      });
    setIsSubmitting(false);
    if (result.result) {
      setSuccessMessage('Message sent successfully');
      if (onSent) onSent();
      // Clear form after successful send
      if (!userId) {
        setSelectedUserId(undefined);
        setRecipientEmail('');
        setPhoneNumber('');
      }
      setSubject('');
      setBody('');
      setCc('');
      setBcc('');
      setSmsMessage('');
      setShowValidation(false);
    }
  };

  const validationErrors = showValidation ? validate() : [];

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  // If a preset userId is provided, load the user's contact details to prefill recipient fields
  useEffect(() => {
    let mounted = true;
    if (userId && show) {
      fetchUsersByIds([userId]).then(users => {
        if (!mounted) return;
        const u = users && users.length > 0 ? users[0] : undefined;
        if (u) {
          if (u.email) setRecipientEmail(u.email);
          if (u.phoneNumber) setPhoneNumber(u.phoneNumber || '');
        }
      }).catch(() => {
        // ignore errors
      });
    }
    return () => { mounted = false; };
  }, [userId, show]);

  const handleCancel = () => {
    setShowValidation(false);
    setSuccessMessage(null);
    if (!userId) setSelectedUserId(undefined);
    onClose();
  };

  return (
    <ModalDialog
      title="Send Message"
      show={show}
      onClose={handleCancel}
      onPrimary={handleSubmit}
      primaryText={isSubmitting ? 'Sending...' : 'Send'}
      disabledPrimary={isSubmitting || validationErrors.length > 0}
      size="lg"
      footerContent={successMessage && <span className="text-success me-auto">{successMessage}</span>}
    >
      <Form>
        {!userId && (
          <div className="mb-3">
            <Form.Label>User *</Form.Label>
            <AsyncSelect<User>
              value={selectedUserId}
              onChange={(val) => {
                setSelectedUserId(val as string | undefined);
                if (val) {
                  const found = lastUserOptions.find(u => u.userId === val);
                  if (found) {
                    if (found.email) setRecipientEmail(found.email);
                    if (found.phoneNumber != null) setPhoneNumber(found.phoneNumber);
                  }
                } else {
                  setRecipientEmail('');
                }
              }}
              loadOptions={async (term) => {
                const res = await searchUsers(term);
                setLastUserOptions(res);
                return res;
              }}
              getOptionLabel={(u) => `${u.firstName} ${u.lastName}`}
              getOptionValue={(u) => u.userId}
              getOptionSubtitle={(u) => u.email}
              placeholder="Select user..."
            />
          </div>
        )}

        <div className="mb-3 mt-2">
          <Form.Label>Channel</Form.Label><br />
          <ButtonGroup aria-label="Channel selection">
            <Button id="channel-email" className={channel === 'email' ? 'active' : ''} onClick={() => setChannel('email')} variant="outline-primary" size="sm">Email</Button>
            <Button id="channel-sms" className={channel === 'sms' ? 'active' : ''} onClick={() => setChannel('sms')} variant="outline-primary" size="sm">SMS</Button>
          </ButtonGroup>
        </div>

        {channel === 'email' && (
          <>
            {/* Recipient full row */}
            <Row>
              <Col md={12} className="mb-3">
                <Form.Label>Recipient Email *</Form.Label>
                <Form.Control type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} placeholder="user@example.com" />
              </Col>
            </Row>
            {/* Subject & Format share row */}
            <Row>
              <Col md={8} className="mb-3">
                <Form.Label>Subject *</Form.Label>
                <Form.Control value={subject} onChange={e => setSubject(e.target.value)} />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Format</Form.Label>
                <Form.Select value={emailType} onChange={e => setEmailType(e.target.value as 'html' | 'txt')}>
                  <option value="txt">Plain Text</option>
                  <option value="html">HTML</option>
                </Form.Select>
              </Col>
            </Row>
            {/* CC & BCC share row */}
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>CC</Form.Label>
                <Form.Control value={cc} onChange={e => setCc(e.target.value)} placeholder="comma separated" />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>BCC</Form.Label>
                <Form.Control value={bcc} onChange={e => setBcc(e.target.value)} placeholder="comma separated" />
              </Col>
            </Row>
            {/* Body full row */}
            <Row>
              <Col md={12} className="mb-3">
                <Form.Label>Body *</Form.Label>
                <Form.Control as="textarea" rows={6} value={body} onChange={e => setBody(e.target.value)} />
              </Col>
            </Row>
          </>
        )}

        {channel === 'sms' && (
          <>
            {/* Phone full row */}
            <Row>
              <Col md={12} className="mb-3">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+123456789" />
              </Col>
            </Row>
            {/* Message full row */}
            <Row>
              <Col md={12} className="mb-3">
                <Form.Label>Message *</Form.Label>
                <Form.Control as="textarea" rows={4} value={smsMessage} onChange={e => setSmsMessage(e.target.value)} />
              </Col>
            </Row>
          </>
        )}
        {/* Validation + API errors displayed at bottom after content */}
        {validationErrors.length > 0 && (
          <Alert variant="danger" className="mt-2">
            {validationErrors.map(e => <div key={e}>{e}</div>)}
          </Alert>
        )}
        <AlertMessage initialErrorMessage={initialErrorMessage} errors={errors} />
      </Form>
    </ModalDialog>
  );
};

export default SendMessageModal;
