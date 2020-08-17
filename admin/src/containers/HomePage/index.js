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
import { POST } from 'fetchier'

import useFetch from './hooks';
import { ALink, Block, Container, LinkWrapper, P, Wave, Separator } from './components';
import BlogPost from './BlogPost';
import SocialLink from './SocialLink';

const HomePage = ({ global: { plugins }, history: { push } }) => {
  const { error, isLoading, posts } = useFetch();
  const username = get(auth.getUserInfo(), 'username', '');
  const [requestToJenkin, setRequestToJenkin] = useState()

  useEffect(() => {
    requestToJenkin ? strapi.lockApp() : strapi.unlockApp()
  }, [requestToJenkin])

  const handleClick = () => {
    setRequestToJenkin(true)
    POST({ url: 'https://admin:118376ff46521e42c6cfb127476c7f01f6@ciaws.clik.asia/jenkins/job/clik-website/job/clik-test.clik.asia/build/?token\=111e7e69164e75490a7c5be59aec9801f8' })
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
