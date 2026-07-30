/**
 * Backend Integration Test Utilities
 * 
 * Use these functions in the browser console to test the backend integration:
 * 
 * import * as test from '@/utils/testBackend';
 * test.runAllTests();
 */

import { healthCheck, storyApi, discussionApi } from './api';

export const testHealthCheck = async () => {
  console.log('🔍 Testing health check...');
  try {
    const result = await healthCheck();
    if (result.success && result.data?.status === 'ok') {
      console.log('✅ Health check passed:', result);
      return true;
    } else {
      console.log('❌ Health check failed:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Health check error:', error);
    return false;
  }
};

export const testStorySubmission = async () => {
  console.log('📝 Testing story submission...');
  try {
    const testStory = {
      title: 'Test Story - ' + new Date().toLocaleTimeString(),
      category: 'Testing',
      story: 'This is a test story to verify the backend integration is working correctly.',
      author: 'Test Suite'
    };

    const result = await storyApi.create(testStory);
    if (result.success && result.data) {
      console.log('✅ Story submitted successfully:', result.data);
      return result.data;
    } else {
      console.log('❌ Story submission failed:', result);
      return null;
    }
  } catch (error) {
    console.error('❌ Story submission error:', error);
    return null;
  }
};

export const testStoryRetrieval = async () => {
  console.log('📖 Testing story retrieval...');
  try {
    const result = await storyApi.getAll();
    if (result.success && result.data) {
      console.log(`✅ Retrieved ${result.data.length} stories:`, result.data);
      return result.data;
    } else {
      console.log('❌ Story retrieval failed:', result);
      return [];
    }
  } catch (error) {
    console.error('❌ Story retrieval error:', error);
    return [];
  }
};

export const testDiscussionSubmission = async () => {
  console.log('💬 Testing discussion submission...');
  try {
    const testDiscussion = {
      title: 'Test Discussion - ' + new Date().toLocaleTimeString(),
      content: 'This is a test discussion to verify the backend integration is working correctly.',
      tag: 'Testing',
      author: 'Test Suite'
    };

    const result = await discussionApi.create(testDiscussion);
    if (result.success && result.data) {
      console.log('✅ Discussion submitted successfully:', result.data);
      return result.data;
    } else {
      console.log('❌ Discussion submission failed:', result);
      return null;
    }
  } catch (error) {
    console.error('❌ Discussion submission error:', error);
    return null;
  }
};

export const testDiscussionRetrieval = async () => {
  console.log('📚 Testing discussion retrieval...');
  try {
    const result = await discussionApi.getAll();
    if (result.success && result.data) {
      console.log(`✅ Retrieved ${result.data.length} discussions:`, result.data);
      return result.data;
    } else {
      console.log('❌ Discussion retrieval failed:', result);
      return [];
    }
  } catch (error) {
    console.error('❌ Discussion retrieval error:', error);
    return [];
  }
};

export const testStoryLike = async (storyId?: string) => {
  console.log('❤️ Testing story like...');
  try {
    // If no story ID provided, get the first one
    if (!storyId) {
      const stories = await testStoryRetrieval();
      if (stories.length === 0) {
        console.log('⚠️ No stories available to like');
        return null;
      }
      storyId = stories[0].id;
    }

    const result = await storyApi.like(storyId);
    if (result.success && result.data) {
      console.log('✅ Story liked successfully:', result.data);
      return result.data;
    } else {
      console.log('❌ Story like failed:', result);
      return null;
    }
  } catch (error) {
    console.error('❌ Story like error:', error);
    return null;
  }
};

export const runAllTests = async () => {
  console.log('🚀 Running all backend integration tests...\n');
  
  const results = {
    healthCheck: false,
    storySubmission: false,
    storyRetrieval: false,
    discussionSubmission: false,
    discussionRetrieval: false,
    storyLike: false
  };

  // Test 1: Health check
  results.healthCheck = await testHealthCheck();
  console.log('');

  // Test 2: Story retrieval
  const stories = await testStoryRetrieval();
  results.storyRetrieval = stories.length > 0;
  console.log('');

  // Test 3: Story submission
  const newStory = await testStorySubmission();
  results.storySubmission = newStory !== null;
  console.log('');

  // Test 4: Story like
  if (stories.length > 0) {
    const liked = await testStoryLike(stories[0].id);
    results.storyLike = liked !== null;
  }
  console.log('');

  // Test 5: Discussion retrieval
  const discussions = await testDiscussionRetrieval();
  results.discussionRetrieval = discussions.length > 0;
  console.log('');

  // Test 6: Discussion submission
  const newDiscussion = await testDiscussionSubmission();
  results.discussionSubmission = newDiscussion !== null;
  console.log('');

  // Summary
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log('📊 Test Summary:');
  console.log(`   Passed: ${passed}/${total}`);
  console.log('   Results:', results);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Backend integration is fully functional.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }

  return results;
};

// Export for window access in browser console
if (typeof window !== 'undefined') {
  (window as any).testBackend = {
    healthCheck: testHealthCheck,
    storySubmission: testStorySubmission,
    storyRetrieval: testStoryRetrieval,
    discussionSubmission: testDiscussionSubmission,
    discussionRetrieval: testDiscussionRetrieval,
    storyLike: testStoryLike,
    runAll: runAllTests
  };
  console.log('💡 Backend test utilities loaded. Run tests with: testBackend.runAll()');
}
