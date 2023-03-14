import Rating from '@/components/Rating/Rating'
import { Text } from '@/components/Typography/Text'
import { Title } from '@/components/Typography/Title'
import { GetProductResponse } from '@/services/products/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as Styled from './styles'

type Props = {
  seller: GetProductResponse['seller']
  variant?: 's' | 'm' | 'l'
  rating?: boolean
  className?: string
}

function SellerInfo({ seller, variant, rating }: Props) {
  return (
    <Styled.UserInfoWrapper variant={variant}>
      <Styled.UserImageWrapper>
        <Image
          layout="fill"
          src={
            seller.avatar
              ? seller.avatar[310]
              : '/assets/images/profile-placeholder.jpeg'
          }
        />
      </Styled.UserImageWrapper>
      <Styled.UserDetailsWrapper>
        <Link href={`/profile/${seller.username}`}>
          <Title>{seller.username}</Title>
        </Link>
        <Text color="disabled">{seller.location}</Text>
        {rating && (
          <Rating rating={seller.rating.rating} count={seller.rating.count} />
        )}
      </Styled.UserDetailsWrapper>
    </Styled.UserInfoWrapper>
  )
}

export default SellerInfo
