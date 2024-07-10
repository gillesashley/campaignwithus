'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import * as PostsService from '../services/postService'
import constituencyService from '@/services/constituencyService'
import industryService from '@/services/industryService'
import { shuffleArray } from '@/utils/listsManipulation'
import regionService from '@/services/regionService'

export const PostsContext = createContext()

export const usePostsContext = () => {
  const context = useContext(PostsContext)

  if (!context) {
    throw new Error('usePostsContext must be used within a PostsProvider')
  }

  const {
    trendingPosts,
    posts,
    loading,
    filterPostsByUserConstituency,
    filterPostsByUserRegion,
    filterPostsByTrending,
    filterAllCampaignPosts,
    filterPostsByIndustry,
    regions,
    constituencies,
    industries,
    activeFilter,
    handleFilterChange,
    postsFilterTitle,
    setPostsFilterTitle,
    loadingConstituencies
  } = context

  return {
    trendingPosts,
    posts,
    loading,
    filterPostsByUserConstituency,
    filterPostsByUserRegion,
    filterPostsByTrending,
    filterAllCampaignPosts,
    filterPostsByIndustry,
    constituencies,
    regions,
    industries,
    activeFilter,
    handleFilterChange,
    postsFilterTitle,
    setPostsFilterTitle,
    loadingConstituencies
  }
}

const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [trendingPosts, setTrendingPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [regions, setRegions] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [allConstituencies, setAllConstituencies] = useState([])
  const [industries, setIndustries] = useState([])
  const [activeFilter, setActiveFilter] = useState('trending')
  const [loading, setLoading] = useState(true)
  const [selectedConstituency, setSelectedConstituency] = useState(null)
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedRegionId, setSelectedRegionId] = useState(null)
  const [postsFilterTitle, setPostsFilterTitle] = useState({
    region: null,
    constituency: null,
    industry: null,
    trending: true
  })
  const [loadingConstituencies, setLoadingConstituencies] = useState(null)

  const [filters, setFilters] = useState({
    region: null,
    constituency: null,
    industry: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, trendingPostsData] = await Promise.all([
          PostsService.getPosts(),
          PostsService.getTrendingPosts()
        ])

        setAllPosts(shuffleArray(postsData.data.data))
        setPosts(trendingPostsData.data.data)
        setTrendingPosts(trendingPostsData.data.data)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
        console.log({ posts, allPosts, trendingPosts })
      }
    }

    const fetchConstituenciesAndIndustriesAndRegions = async () => {
      try {
        const [constituenciesResponse, industriesResponse, regionsResponse] = await Promise.all([
          constituencyService.getConstituencies(),
          industryService.getIndustries(),
          regionService.getRegions()
        ])

        setConstituencies(constituenciesResponse.data.data)
        setAllConstituencies(constituenciesResponse.data.data)
        setIndustries(industriesResponse.data.data)
        setRegions(regionsResponse.data.data)
      } catch (error) {
        console.error('Failed to fetch constituencies and industries and regions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    fetchConstituenciesAndIndustriesAndRegions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters])

  const handleFilterChange = (filterType, value, selectedData) => {
    if (filterType === 'constituency') {
      setSelectedConstituency(selectedData?.name || null)
    } else if (filterType === 'industry') {
      setSelectedIndustry(selectedData?.name || null)
    } else if (filterType === 'region') {
      setSelectedRegion(selectedData?.name || null)
      setSelectedRegionId(selectedData?._id || null)
    }

    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value }))
  }

  const applyFilters = () => {
    let filteredPosts = []

    if (filters.region) {
      filterConstituenciesByRegion()
    }

    //Region Alone
    if (filters.region && !filters.industry && !filters.constituency) {
      console.log('Filter By Region Only')
      filteredPosts = allPosts.filter(post => post.regionId?.name === selectedRegion)
      setActiveFilter('region')
      //Update Posts Filter Title with region as location
    }

    //Industry and Region
    if (filters.industry && filters.region && !filters.constituency) {
      console.log('Filter By Industry & Region Only')
      filteredPosts = allPosts.filter(
        post => post.industryId?.name === selectedIndustry && post.regionId?.name === selectedRegion
      )
      setActiveFilter('region-industry')
    }

    //Region and Constituency
    if (filters.constituency && filters.region && !filters.industry) {
      console.log('Filter By Region & Constituency Only')
      filteredPosts = allPosts.filter(
        post => post.regionId?.name === selectedRegion && post.constituencyId?.name === selectedConstituency
      )
      setActiveFilter('region-constituency')
    }

    //Region, Industry and Constituency
    if (filters.constituency && filters.industry && filters.region) {
      console.log('Filter By Industry, Region & Constituency Only')
      filteredPosts = allPosts.filter(
        post =>
          post.industryId?.name === selectedIndustry &&
          post.regionId?.name === selectedRegion &&
          post.constituencyId?.name === selectedConstituency
      )
      setActiveFilter('region-constituency-industry')
    }

    //Constituency Alone
    if (filters.constituency && !filters.industry && !filters.region) {
      console.log('Filter By Constituency Only')
      filteredPosts = allPosts.filter(post => post.constituencyId?.name === selectedConstituency)
      setActiveFilter('constituency')
    }

    //Constituency and Industry
    if (filters.industry && !filters.region && filters.constituency) {
      console.log('Filter By Industry & Constituency Only')
      filteredPosts = allPosts.filter(
        post => post.industryId?.name === selectedIndustry && post.constituencyId?.name === selectedConstituency
      )
      setActiveFilter('constituency-industry')
    }

    //Industry Alone
    if (filters.industry && !filters.region && !filters.constituency) {
      console.log('Filter By Industry Only')
      filteredPosts = allPosts.filter(post => post.industryId?.name === selectedIndustry)
      setActiveFilter('industry')
    }

    //No Filter
    if (!filters.industry && !filters.region && !filters.constituency) {
      console.log('No Filter')
      setConstituencies(allConstituencies)
      filteredPosts = allPosts
      setActiveFilter('all')
    }

    //Check if there is filters.trending
    if (activeFilter == 'trending' && !filters.industry && !filters.region && !filters.constituency) {
      console.log('Filter By Trending Only')
      filteredPosts = trendingPosts
      setActiveFilter('trending')
      setPostsFilterTitle(prev => ({ ...prev, trending: true }))
    }

    // Update posts using prevState for correct state update
    // setPosts(prevPosts => {
    //   console.log('Updating Posts:', filteredPosts)
    //   return [...filteredPosts] // Copying the filteredPosts array to trigger state update
    // })

    setPosts(filteredPosts)
  }

  const filterPostsByTrending = () => {
    setPosts(trendingPosts)
    setActiveFilter('trending')
  }

  const filterAllCampaignPosts = () => {
    setPosts(allPosts)
    setActiveFilter('all')
  }

  const filterPostsByUserConstituency = userConstituencyId => {
    if (allPosts.length < 1) return

    //Filter allPosts where the post.constituencyId?._id = userConstituencyId
    const filteredPosts = allPosts.filter(post => post.constituencyId?._id === userConstituencyId)
    setPosts(filteredPosts)
    setActiveFilter('user-constituency')
  }

  const filterPostsByUserRegion = userRegionId => {
    if (allPosts.length < 1) return

    //Filter allPosts where the post.regionId?._id = userRegionId
    const filteredPosts = allPosts.filter(post => post.regionId?._id === userRegionId)
    setPosts(filteredPosts)
    setActiveFilter('user-region')
  }

  const filterPostsByIndustry = industryId => {
    if (!industryId || allPosts.length < 1) return

    const filteredPosts = allPosts.filter(post => post.industryId?._id === industryId)
    // setPosts(filteredPosts)
    setActiveFilter('industry')
  }

  const filterConstituenciesByRegion = async () => {
    setLoadingConstituencies(true)
    try {
      const filteredConstituencies = await constituencyService.getConstituencies(selectedRegionId)
      setConstituencies(filteredConstituencies.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingConstituencies(false)
    }
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        trendingPosts,
        loading,
        filterPostsByUserConstituency,
        filterPostsByUserRegion,
        filterPostsByTrending,
        filterAllCampaignPosts,
        filterPostsByIndustry,
        regions,
        constituencies,
        industries,
        activeFilter,
        handleFilterChange,
        postsFilterTitle,
        setPostsFilterTitle,
        loadingConstituencies
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export default PostsProvider
