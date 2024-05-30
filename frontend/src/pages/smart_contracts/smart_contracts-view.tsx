import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/smart_contracts/smart_contractsSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const Smart_contractsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { smart_contracts } = useAppSelector((state) => state.smart_contracts);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View smart_contracts')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View smart_contracts')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>ContractName</p>
            <p>{smart_contracts?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Code</p>
            {smart_contracts.code ? (
              <p dangerouslySetInnerHTML={{ __html: smart_contracts.code }} />
            ) : (
              <p>No data</p>
            )}
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Status</p>
            <p>{smart_contracts?.status ?? 'No data'}</p>
          </div>

          <FormField label='DeployedAt'>
            {smart_contracts.deployed_at ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  smart_contracts.deployed_at
                    ? new Date(
                        dayjs(smart_contracts.deployed_at).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No DeployedAt</p>
            )}
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Developer</p>

            <p>{smart_contracts?.developer?.firstName ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Team</p>

            <p>{smart_contracts?.team?.name ?? 'No data'}</p>
          </div>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>organization</p>

              <p>{smart_contracts?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <>
            <p className={'block font-bold mb-2'}>Audits SmartContract</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Result</th>

                      <th>AuditedAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {smart_contracts.audits_smart_contract &&
                      Array.isArray(smart_contracts.audits_smart_contract) &&
                      smart_contracts.audits_smart_contract.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/audits/audits-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='result'>{item.result}</td>

                          <td data-label='audited_at'>
                            {dataFormatter.dateTimeFormatter(item.audited_at)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!smart_contracts?.audits_smart_contract?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/smart_contracts/smart_contracts-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Smart_contractsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_SMART_CONTRACTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Smart_contractsView;
