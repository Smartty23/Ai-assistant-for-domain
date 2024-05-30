import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/organizations/organizationsSlice';
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

const OrganizationsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { organizations } = useAppSelector((state) => state.organizations);

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
        <title>{getPageTitle('View organizations')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View organizations')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{organizations?.name}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Users Organization</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>

                      <th>Last Name</th>

                      <th>Phone Number</th>

                      <th>E-Mail</th>

                      <th>Disabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.users_organization &&
                      Array.isArray(organizations.users_organization) &&
                      organizations.users_organization.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/users/users-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='firstName'>{item.firstName}</td>

                          <td data-label='lastName'>{item.lastName}</td>

                          <td data-label='phoneNumber'>{item.phoneNumber}</td>

                          <td data-label='email'>{item.email}</td>

                          <td data-label='disabled'>
                            {dataFormatter.booleanFormatter(item.disabled)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organizations?.users_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Audits organization</p>
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
                    {organizations.audits_organization &&
                      Array.isArray(organizations.audits_organization) &&
                      organizations.audits_organization.map((item: any) => (
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
              {!organizations?.audits_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Notifications organization</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Message</th>

                      <th>SentAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.notifications_organization &&
                      Array.isArray(organizations.notifications_organization) &&
                      organizations.notifications_organization.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/notifications/notifications-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='message'>{item.message}</td>

                            <td data-label='sent_at'>
                              {dataFormatter.dateTimeFormatter(item.sent_at)}
                            </td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!organizations?.notifications_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>
              Smart_contracts organization
            </p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>ContractName</th>

                      <th>Status</th>

                      <th>DeployedAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.smart_contracts_organization &&
                      Array.isArray(
                        organizations.smart_contracts_organization,
                      ) &&
                      organizations.smart_contracts_organization.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/smart_contracts/smart_contracts-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='name'>{item.name}</td>

                            <td data-label='status'>{item.status}</td>

                            <td data-label='deployed_at'>
                              {dataFormatter.dateTimeFormatter(
                                item.deployed_at,
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!organizations?.smart_contracts_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Teams organization</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>TeamName</th>

                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.teams_organization &&
                      Array.isArray(organizations.teams_organization) &&
                      organizations.teams_organization.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/teams/teams-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='description'>{item.description}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organizations?.teams_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/organizations/organizations-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

OrganizationsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_ORGANIZATIONS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default OrganizationsView;
