import { gql } from '@apollo/client';
import { Client } from '../../../../utilities/client';
import { useEffect, useState } from 'react';
import { User } from '../../../../utilities/getUsers';
import { selectSelectedUser } from '../../store';
import { useSelector } from '../../../redux';

export function useGetParticipant(chatId: string | undefined) {
  const [participant, setParticipant] = useState<User | null>(
    useSelector(selectSelectedUser)
  );

  useEffect(() => {
    (async () => {
      if (chatId) {
        const res = await Client.client.readFragment({
          fragment: gql`
            fragment ChatDetails on Chat {
              participant {
                username
                displayName
                profilePic
              }
            }
          `,
          id: `Chat:${chatId}`,
        });
        setParticipant(res?.participant);
      }
    })();
  }, [chatId]);

  return { participant };
}
