import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/audits/auditsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditAudits = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    smart_contract: '',

    auditor: '',

    report: '',

    result: '',

    audited_at: new Date(),

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { audits } = useAppSelector((state) => state.audits);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { auditsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: auditsId }));
  }, [auditsId]);

  useEffect(() => {
    if (typeof audits === 'object') {
      setInitialValues(audits);
    }
  }, [audits]);

  useEffect(() => {
    if (typeof audits === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = audits[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [audits]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: auditsId, data }));
    await router.push('/audits/audits-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit audits')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit audits'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='SmartContract' labelFor='smart_contract'>
                <Field
                  name='smart_contract'
                  id='smart_contract'
                  component={SelectField}
                  options={initialValues.smart_contract}
                  itemRef={'smart_contracts'}
                  showField={'name'}
                ></Field>
              </FormField>

              <FormField label='Auditor' labelFor='auditor'>
                <Field
                  name='auditor'
                  id='auditor'
                  component={SelectField}
                  options={initialValues.auditor}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='Report' hasTextareaHeight>
                <Field
                  name='report'
                  id='report'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField label='Result' labelFor='result'>
                <Field name='Result' id='Result' component='select'>
                  <option value='Passed'>Passed</option>

                  <option value='Failed'>Failed</option>
                </Field>
              </FormField>

              <FormField label='AuditedAt'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.audited_at
                      ? new Date(
                          dayjs(initialValues.audited_at).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, audited_at: date })
                  }
                />
              </FormField>

              {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
                <FormField label='organization' labelFor='organization'>
                  <Field
                    name='organization'
                    id='organization'
                    component={SelectField}
                    options={initialValues.organization}
                    itemRef={'organizations'}
                    showField={'name'}
                  ></Field>
                </FormField>
              )}

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/audits/audits-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditAudits.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_AUDITS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditAudits;
