import React from 'react';
import CardBox from '../CardBox';
import ImageField from '../ImageField';
import dataFormatter from '../../helpers/dataFormatter';
import { saveFile } from '../../helpers/fileSaver';
import ListActionsPopover from '../ListActionsPopover';
import { useAppSelector } from '../../stores/hooks';
import { Pagination } from '../Pagination';
import LoadingSpinner from '../LoadingSpinner';

import { hasPermission } from '../../helpers/userPermissions';

type Props = {
  smart_contracts: any[];
  loading: boolean;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  currentPage: number;
  numPages: number;
  onPageChange: (page: number) => void;
};

const ListSmart_contracts = ({
  smart_contracts,
  loading,
  onEdit,
  onView,
  onDelete,
  currentPage,
  numPages,
  onPageChange,
}: Props) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const hasUpdatePermission = hasPermission(
    currentUser,
    'UPDATE_SMART_CONTRACTS',
  );

  return (
    <>
      <div className='relative overflow-x-auto p-4 space-y-4'>
        {loading && <LoadingSpinner />}
        {!loading &&
          smart_contracts.map((item) => (
            <CardBox hasTable key={item.id} className={'rounded'}>
              <div className={'flex items-center overflow-hidden'}>
                <div
                  className={
                    'flex-1 px-4 py-6 h-24 flex items-stretch divide-x-2 dark:divide-dark-700 overflow-x-auto'
                  }
                  onClick={() => onView(item.id)}
                >
                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>ContractName</p>
                    <p className={'line-clamp-2'}>{item.name}</p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>Code</p>
                    <p className={'line-clamp-2'}>{item.code}</p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>Status</p>
                    <p className={'line-clamp-2'}>{item.status}</p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>DeployedAt</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter.dateTimeFormatter(item.deployed_at)}
                    </p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>Developer</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter.usersOneListFormatter(item.developer)}
                    </p>
                  </div>

                  <div className={'flex-1 px-3'}>
                    <p className={'text-xs text-gray-500'}>Team</p>
                    <p className={'line-clamp-2'}>
                      {dataFormatter.teamsOneListFormatter(item.team)}
                    </p>
                  </div>
                </div>
                <ListActionsPopover
                  onDelete={onDelete}
                  onView={onView}
                  onEdit={onEdit}
                  itemId={item.id}
                  hasUpdatePermission={hasUpdatePermission}
                />
              </div>
            </CardBox>
          ))}
        {!loading && smart_contracts.length === 0 && (
          <div className='col-span-full flex items-center justify-center h-40'>
            <p className=''>No data to display</p>
          </div>
        )}
      </div>
      <div className={'flex items-center justify-center my-6'}>
        <Pagination
          currentPage={currentPage}
          numPages={numPages}
          setCurrentPage={onPageChange}
        />
      </div>
    </>
  );
};

export default ListSmart_contracts;
