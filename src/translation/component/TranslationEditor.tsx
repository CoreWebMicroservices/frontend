import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ButtonGroup, Alert, Card, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Trash, Search, Plus } from 'react-bootstrap-icons';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import { useTranslationState } from '@/translation/store/TranslationState';
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/component/ApiResponseAlert';
import { APP_ROUTES } from '@/app/router/routes';
import Breadcrumb from '@/common/component/Breadcrumb';

type ViewMode = 'form' | 'json';

interface TranslationEntry {
  key: string;
  value: string;
}

export const TranslationEditor: React.FC = () => {
  const { realm, lang } = useParams<{ realm: string; lang: string }>();
  const navigate = useNavigate();
  const { getTranslation, updateTranslation, deleteTranslation } = useTranslationState();
  const { success, errors, handleResponse } = useMessageState();

  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [entries, setEntries] = useState<TranslationEntry[]>([]);
  const [jsonText, setJsonText] = useState('{}');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newRealm, setNewRealm] = useState('');
  const [newLang, setNewLang] = useState('');

  const isNewTranslation = !realm || !lang;
  const effectiveRealm = realm || newRealm;
  const effectiveLang = lang || newLang;

  useEffect(() => {
    if (realm && lang) {
      loadTranslations();
    } else {
      setEntries([{ key: '', value: '' }]);
      setJsonText('{}');
    }
  }, [realm, lang]);

  const loadTranslations = async () => {
    if (!realm || !lang) return;
    
    setIsLoading(true);
    const result = await getTranslation(realm, lang);
    setIsLoading(false);

    if (result.result && result.response) {
      const translations = result.response.translations;
      const loadedEntries = Object.entries(translations).map(([key, value]) => ({
        key,
        value
      }));
      setEntries(loadedEntries.length > 0 ? loadedEntries : [{ key: '', value: '' }]);
      setJsonText(JSON.stringify(translations, null, 2));
      setJsonError(null);
    }
  };

  const handleSave = async () => {
    if (!effectiveRealm || !effectiveLang) {
      handleResponse(
        { result: false, response: null, errors: [{ reasonCode: 'VALIDATION', description: 'Realm and language are required' }] },
        'Realm and language are required'
      );
      return;
    }

    let translations: Record<string, string>;
    
    if (viewMode === 'json') {
      try {
        translations = JSON.parse(jsonText);
        setJsonError(null);
      } catch {
        setJsonError('Invalid JSON format. Please fix the syntax errors.');
        return;
      }
    } else {
      translations = entries.reduce((acc, entry) => {
        if (entry.key.trim() && entry.value.trim()) {
          acc[entry.key.trim()] = entry.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);
    }

    if (Object.keys(translations).length === 0) {
      handleResponse(
        { result: false, response: null, errors: [{ reasonCode: 'VALIDATION', description: 'At least one translation is required' }] },
        'At least one translation is required'
      );
      return;
    }

    setIsSaving(true);
    const result = await updateTranslation(effectiveRealm, effectiveLang, { translations });
    setIsSaving(false);

    handleResponse(
      result,
      'Failed to save translations.',
      `Translations for ${effectiveRealm}/${effectiveLang} saved successfully!`
    );

    if (result.result) {
      loadTranslations();
    }
  };

  const handleDelete = async () => {
    if (!realm || !lang) return;

    setIsSaving(true);
    const result = await deleteTranslation(realm, lang);
    setIsSaving(false);

    handleResponse(
      result,
      'Failed to delete translations.',
      `Translations for ${realm}/${lang} deleted successfully!`
    );

    if (result.result) {
      setTimeout(() => navigate(APP_ROUTES.TRANSLATIONS), 1500);
    }
  };

  const addEntry = () => {
    setEntries([...entries, { key: '', value: '' }]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const syncJsonToForm = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const newEntries = Object.entries(parsed).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      setEntries(newEntries.length > 0 ? newEntries : [{ key: '', value: '' }]);
      setJsonError(null);
    } catch {
      setJsonError('Invalid JSON format. Cannot sync to form view.');
    }
  };

  const syncFormToJson = () => {
    const newJson = entries.reduce((acc, entry) => {
      if (entry.key.trim()) {
        acc[entry.key.trim()] = entry.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);
    setJsonText(JSON.stringify(newJson, null, 2));
    setJsonError(null);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    if (mode === 'json' && viewMode === 'form') {
      syncFormToJson();
    } else if (mode === 'form' && viewMode === 'json') {
      syncJsonToForm();
    }
    setViewMode(mode);
  };

  const filteredEntries = entries.filter(entry => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return entry.key.toLowerCase().includes(term) || entry.value.toLowerCase().includes(term);
  });

  if (isLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center py-5">Loading translations...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Breadcrumb 
        items={[
          { label: 'Translations', href: APP_ROUTES.TRANSLATIONS },
          { label: isNewTranslation ? 'New Translation' : `${effectiveRealm} / ${effectiveLang}`, active: true }
        ]} 
      />

      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h3>
              {isNewTranslation 
                ? 'New Translation' 
                : `Edit - Realm: ${effectiveRealm}, Language: ${effectiveLang}`}
            </h3>
            <div className="d-flex gap-2">
              {!isNewTranslation && (
                <Button 
                  variant="outline-danger" 
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSaving}
                >
                  <Trash className="me-1" /> Delete
                </Button>
              )}
              <Button 
                variant="primary" 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="me-1" /> {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <AlertMessage success={success} errors={errors} />

      {showDeleteConfirm && (
        <Alert variant="danger" className="mb-3">
          <Alert.Heading>Confirm Deletion</Alert.Heading>
          <p>Are you sure you want to delete all translations for <strong>{effectiveRealm}/{effectiveLang}</strong>?</p>
          <div className="d-flex gap-2">
            <Button variant="danger" size="sm" onClick={handleDelete}>Yes, Delete</Button>
            <Button variant="outline-secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          </div>
        </Alert>
      )}

      <Card className="mb-3">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Realm</Form.Label>
              <Form.Control 
                value={effectiveRealm} 
                onChange={(e) => isNewTranslation && setNewRealm(e.target.value)} 
                placeholder="e.g., app, admin, public"
                disabled={!isNewTranslation}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Language</Form.Label>
              <Form.Control 
                value={effectiveLang} 
                onChange={(e) => isNewTranslation && setNewLang(e.target.value)}
                placeholder="e.g., en, es, fr"
                disabled={!isNewTranslation}
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-between align-items-center mb-3">
            {viewMode === 'form' && (
              <InputGroup style={{ maxWidth: '350px' }}>
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search keys or values..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  size="sm"
                />
              </InputGroup>
            )}
            {viewMode === 'json' && <div />}

            <div className="d-flex gap-2 align-items-center">
              {viewMode === 'form' && (
                <Button variant="outline-primary" size="sm" onClick={addEntry}>
                  <Plus size={16} /> Add
                </Button>
              )}

              <ButtonGroup>
                <Button 
                  variant={viewMode === 'form' ? 'primary' : 'outline-primary'}
                  onClick={() => handleViewModeChange('form')}
                  size="sm"
                >
                  Form View
                </Button>
                <Button 
                  variant={viewMode === 'json' ? 'primary' : 'outline-primary'}
                  onClick={() => handleViewModeChange('json')}
                  size="sm"
                >
                  JSON View
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {viewMode === 'form' ? (
            <div style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
              {filteredEntries.length === 0 ? (
                <Alert variant="info">No translations match your search.</Alert>
              ) : (
                filteredEntries.map((entry) => {
                  const actualIndex = entries.indexOf(entry);
                  return (
                    <Row key={actualIndex} className="mb-2 g-2">
                      <Col md={4}>
                        <Form.Control
                          placeholder="Key"
                          value={entry.key}
                          onChange={e => updateEntry(actualIndex, 'key', e.target.value)}
                          size="sm"
                        />
                      </Col>
                      <Col md={7}>
                        <Form.Control
                          placeholder="Value"
                          value={entry.value}
                          onChange={e => updateEntry(actualIndex, 'value', e.target.value)}
                          size="sm"
                        />
                      </Col>
                      <Col md={1} className="d-flex align-items-center justify-content-center">
                        {entries.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeEntry(actualIndex)}
                          >
                            <Trash size={14} />
                          </Button>
                        )}
                      </Col>
                    </Row>
                  );
                })
              )}
            </div>
          ) : (
            <div>
              <AceEditor
                mode="json"
                theme="github"
                value={jsonText}
                onChange={setJsonText}
                name="json-editor"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  useWorker: false,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
                style={{
                  width: '100%',
                  height: '500px',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6'
                }}
              />
              {jsonError && (
                <Alert variant="danger" className="mt-2">
                  {jsonError}
                </Alert>
              )}
              <Alert variant="info" className="mt-2">
                <small>Edit the JSON directly. Changes will be validated when you save.</small>
              </Alert>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TranslationEditor;
