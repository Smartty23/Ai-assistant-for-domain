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

import {
  update,
  fetch,
} from '../../stores/smart_contracts/smart_contractsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditSmart_contracts = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    name: '',

    code: '',

    status: '',

    deployed_at: new Date(),

    developer: '',

    team: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { smart_contracts } = useAppSelector((state) => state.smart_contracts);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { smart_contractsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: smart_contractsId }));
  }, [smart_contractsId]);

  useEffect(() => {
    if (typeof smart_contracts === 'object') {
      setInitialValues(smart_contracts);
    }
  }, [smart_contracts]);

  useEffect(() => {
    if (typeof smart_contracts === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = smart_contracts[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [smart_contracts]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: smart_contractsId, data }));
    await router.push('/smart_contracts/smart_contracts-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit smart_contracts')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit smart_contracts'}
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
              <FormField label='ContractName'>
                <Field name='name' placeholder='ContractName' />
              </FormField>

              <FormField label='Code' hasTextareaHeight>
                <Field name='code' id='code' component={RichTextField}></Field>
              </FormField>

              <FormField label='Status' labelFor='status'>
                <Field name='Status' id='Status' component='select'>
                  <option value='Draft'>Draft</option>

                  <option value='Deployed'>Deployed</option>

                  <option value='Failed'>Failed</option>
                </Field>
              </FormField>

              <FormField label='DeployedAt'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.deployed_at
                      ? new Date(
                          dayjs(initialValues.deployed_at).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, deployed_at: date })
                  }
                />
              </FormField>

              <FormField label='Developer' labelFor='developer'>
                <Field
                  name='developer'
                  id='developer'
                  component={SelectField}
                  options={initialValues.developer}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='Team' labelFor='team'>
                <Field
                  name='team'
                  id='team'
                  component={SelectField}
                  options={initialValues.team}
                  itemRef={'teams'}
                  showField={'name'}
                ></Field>
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
                  onClick={() =>
                    router.push('/smart_contracts/smart_contracts-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditSmart_contracts.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_SMART_CONTRACTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditSmart_contracts;
