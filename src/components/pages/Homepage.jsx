'use client'
import React, { useEffect, useState } from 'react'
import { PublicPagesLayout } from '../layout/public-pages-layout/PublicPagesLayout'
import { CircularProgress, Grid, Typography } from '@mui/material'
import { BlogPostCard } from './BlogPostCard'

import PostsProvider, { usePostsContext } from '@/providers/PostsProvider'
import pointTypeService from '@/services/pointTypeService'

export const Homepage = () => {
  const { posts, loading, postsFilterTitle } = usePostsContext()
  const [pointTypes, setPointTypes] = useState([])
  const [postsTitle, setPostsTitle] = useState('Campaign Posts')
  useEffect(() => {
    const fetchPointTypes = async () => {
      try {
        const { data } = await pointTypeService.getPointTypes()
        setPointTypes(data.data)
      } catch (error) {
        console.error(error) // Using console.error for error logging
      }
    }

    fetchPointTypes()
  }, [])

  useEffect(() => {
    const setPostsFilterTitle = () => {
      //No Location
      if (!postsFilterTitle?.region && !postsFilterTitle?.constituency && !postsFilterTitle?.industry) {
        setPostsTitle(`All Campaign Posts`)
      }

      //Only Region
      if (postsFilterTitle?.region && !postsFilterTitle?.constituency && !postsFilterTitle?.industry) {
        setPostsTitle(`Campaign Posts in ${postsFilterTitle?.region} Region`)
      }

      //Only Constituency
      if (!postsFilterTitle?.region && postsFilterTitle?.constituency && !postsFilterTitle?.industry) {
        setPostsTitle(`Campaign Posts in ${postsFilterTitle?.constituency} Constituency`)
      }

      //Only Industry
      if (!postsFilterTitle?.region && !postsFilterTitle?.constituency && postsFilterTitle?.industry) {
        setPostsTitle(`Campaign Posts in ${postsFilterTitle?.industry} Industry/Sector`)
      }

      //Region & Constituency
      if (postsFilterTitle?.region && postsFilterTitle?.constituency && !postsFilterTitle?.industry) {
        setPostsTitle(
          `Campaign Posts in ${postsFilterTitle?.constituency} Constituency, ${postsFilterTitle?.region} Region`
        )
      }

      //Region & Industry
      if (postsFilterTitle?.region && !postsFilterTitle?.constituency && postsFilterTitle?.industry) {
        setPostsTitle(
          `Campaign Posts in ${postsFilterTitle?.region} Region, ${postsFilterTitle?.industry} Industry/Sector`
        )
      }

      //Constituency & Industry
      if (!postsFilterTitle?.region && postsFilterTitle?.constituency && postsFilterTitle?.industry) {
        setPostsTitle(
          `Campaign Posts in ${postsFilterTitle?.constituency} Constituency, ${postsFilterTitle?.industry} Industry/Sector`
        )
      }

      //Constituency & Industry & Region
      if (postsFilterTitle?.region && postsFilterTitle?.constituency && postsFilterTitle?.industry) {
        setPostsTitle(`Campaign Posts in ${postsFilterTitle?.constituency} Constituency, ${postsFilterTitle?.industry}`)
      }

      if (
        postsFilterTitle?.trending &&
        !postsFilterTitle?.region &&
        !postsFilterTitle?.constituency &&
        !postsFilterTitle?.industry
      ) {
        setPostsTitle(`Trending Campaign Posts`)
      }
    }

    setPostsFilterTitle()
  }, [postsFilterTitle])

  return (
    <PublicPagesLayout>
      <Typography variant='h4' gutterBottom>
        {postsTitle}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4}>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <BlogPostCard post={post} pointTypes={pointTypes} />
              </Grid>
            ))
          ) : (
            <Grid item>
              <Typography>No Posts Available.</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </PublicPagesLayout>
  )
}
