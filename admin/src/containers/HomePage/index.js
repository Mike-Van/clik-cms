/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, { memo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, upperFirst } from 'lodash';
import { auth } from 'strapi-helper-plugin';
import PageTitle from '../../components/PageTitle';
import { fetch } from 'fetchier'

import useFetch from './hooks';
import { ALink, Block, Container, LinkWrapper, P, Wave, Separator } from './components';

const HomePage = ({ global: { plugins }, history: { push } }) => {
  const { error, isLoading, posts } = useFetch();
  const username = get(auth.getUserInfo(), 'username', '');
  const [requestToJenkin, setRequestToJenkin] = useState()

  useEffect(() => {
    requestToJenkin ? strapi.lockApp() : strapi.unlockApp()
  }, [requestToJenkin])

  const handleClick = () => {
    setRequestToJenkin(true)
    fetch('https://us-central1-clik-1543905619703.cloudfunctions.net/trigger', { method: 'GET', mode: 'no-cors' })
      .then(res => {
        setRequestToJenkin()
        strapi.notification.success('site.build.success')
        console.log('successfully request to jenkin', res)
      })
      .catch(err => {
        setRequestToJenkin()
        strapi.notification.error('site.build.error')
        console.log('error requesting to jenkin', err)
      })
  }

  const linkProps = {
    id: 'site.build.button',
    onClick: handleClick,
    href: '#',
    type: 'documentation'
  }

  return (
    <>
      <FormattedMessage id="HomePage.helmet.title">
        {title => <PageTitle title={title} />}
      </FormattedMessage>
      <Container className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <Block>
              <Wave />
              <FormattedMessage
                id="site.build.header"
                values={{ name: upperFirst(username) }}
              >
                {msg => <h2 id="mainHeader">{msg}</h2>}
              </FormattedMessage>
              <FormattedMessage id="site.build.description">
                {msg => <P>{msg}</P>}
              </FormattedMessage>
              <FormattedMessage id={linkProps.id}>
                {msg => (
                  <ALink
                    rel="noopener noreferrer"
                    {...linkProps}
                    style={{ verticalAlign: ' bottom', marginBottom: 5 }}
                  >
                    {msg}
                  </ALink>
                )}
              </FormattedMessage>
            </Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);
