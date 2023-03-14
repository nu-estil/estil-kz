import Head from '@/components/Head/Head'
import Layout from '@/components/Layout/Layout'
import FillContainerLoader from '@/components/Loader/FillContainerLoader/FillContainerLoader'
import { config } from '@/config'
import { saveToken } from '@/modules/auth/slice'
import Followings from '@/modules/users/modules/profile/routes/followings/Followings'
import usersApi from '@/services/users/api'
import { wrapper } from '@/store/store'
import { AppNextPage } from '@/types'
import get from 'lodash/get'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Error from 'next/error'
import { useRouter } from 'next/router'

const FollowingsPage: AppNextPage = () => {
  const router = useRouter()

  const username = get(router, 'query.username')
  const {
    data: users,
    isLoading,
    error
  } = usersApi.endpoints.getFollowings.useQuery(username)

  if (error) return <Error statusCode={404} />

  if (isLoading) <FillContainerLoader />

  return (
    <Layout.Container>
      <Layout.Section>
        <Head
          title={`${username} followings`}
          url={`${config.seo.meta.og.url}/profile/${username}/followings`}
        />
        {users && <Followings followings={users} />}
      </Layout.Section>
    </Layout.Container>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale, params, req }) => {
      store.dispatch(saveToken(req.cookies.access as string))
      const username = params?.username

      if (typeof username === 'string') {
        store.dispatch(
          usersApi.endpoints.getFollowings.initiate(params!.username as string)
        )
      }
      await Promise.all(usersApi.util.getRunningOperationPromises())

      return {
        props: {
          ...(await serverSideTranslations(locale!, ['common']))
        }
      }
    }
)

FollowingsPage.getLayout = function (page) {
  return (
    <Layout>
      <Layout.Header />
      <Layout.Main>{page}</Layout.Main>
      <Layout.Footer />
    </Layout>
  )
}

export default FollowingsPage
