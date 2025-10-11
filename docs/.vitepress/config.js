export default {
  title: 'Yumlabs Documentation',
  description: 'Generated documentation from Markdown files and MongoDB data',
  base: '/markdown-gen/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },

    ],
    sidebar: [
      {
        text: '📚 Documentation',
        collapsible: true,
        collapsed: false,
        items: [
          {
            text: '🏠 Overview',
            collapsible: true,
            collapsed: false,
            items: [
              { text: 'Home', link: '/home' }
            ]
          },
          {
            text: '📖 Project Overviews',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Cargo Mix README', link: '/cargo-mix-readme' },
              { text: 'Luna Sama README', link: '/luna-sama-readme' },
              { text: 'Yumlabs README', link: '/yumlabs-readme' }
            ]
          },
          {
            text: '⚙️ Development & Technical',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Architecture', link: '/architecture' },
              { text: 'Building a Local Neurosama', link: '/building-local-neurosama' },
              { text: 'COsuDE Developer Docs', link: '/cosude-developer-docs' },
              { text: 'Yumlabs Developer Doc', link: '/yumlabs-developer-doc' },
              { text: 'Rust Dev', link: '/rust-dev' },
              { text: 'Yumlabs Build Optimization', link: '/yumlabs-build-optimization' }
            ]
          },
          {
            text: '🎯 Planning & Strategy',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'AI Talk Show Gameplan', link: '/ai-talk-show-gameplan' },
              { text: 'Conversation (Talk Show)', link: '/conversation-talk-show' },
              { text: 'Feature Ideas (COsuDE)', link: '/feature-ideas-cosude' },
              { text: 'Investment Strategy Plan', link: '/investment-strategy-plan' },
              { text: 'Plan - Perplexity.ai Automation', link: '/plan.md-83' }
            ]
          },
          {
            text: 'ℹ️ Project Information',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'CNH', link: '/cnh' },
              { text: 'Odin Information', link: '/odin-information' },
              { text: 'Odin Overview', link: '/odin-overview' }
            ]
          },
          {
            text: '🛠️ Standards & Tools',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Accuracy Verification', link: '/accuracy-verification' },
              { text: 'Commit Message', link: '/commit-message' },
              { text: 'OpenCode Rules', link: '/opencode-rules' },
              { text: 'Perplexity Batch Query Tool', link: '/perplexity-batch-query-tool' },
              { text: 'Pull Request Template', link: '/pull-request-template' },
               { text: 'Finance Data Template', link: '/finance_data_template' },
               { text: 'LLM Response Template', link: '/llm_response_template' }
            ]
          },
          {
            text: '🚀 Projects & Implementations',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Old School RuneScape (OSRS) Clone', link: '/osrs-clone' },
              { text: 'Yumlabs Finance Implementation', link: '/yumlabs-finance-implementation' }
            ]
          }
        ]
      },
      {
        text: '📊 Generated Data',
        collapsible: true,
        collapsed: true,
        items: [
          {
            text: 'Finance Data Records',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'Finance Data (Oct 11)', link: '/finance_data_68e98dd5200413ad9c0dd1cb_20251011_121956' },
              { text: 'Finance Data (Oct 11)', link: '/finance_data_68e2cb2031308dd4d7cef05c_20251011_121956' },
              { text: 'Finance Data (Oct 11)', link: '/finance_data_68e57c908f14cd7f4a6b816e_20251011_121956' },
              { text: 'Finance Data (Oct 11)', link: '/finance_data_68e169c4b2cdbbf7865a8f8c_20251011_121956' },
              // Note: There are additional finance_data files that can be added similarly
            ]
          },
          {
            text: 'LLM Response Records',
            collapsible: true,
            collapsed: true,
            items: [
              { text: 'LLM Response (Oct 11)', link: '/llm_response_68dd1f52292b8087b556615a_20251011_121956' },
              { text: 'LLM Response (Oct 11)', link: '/llm_response_68dd25bbe811cbe7f1cc5a7a_20251011_121956' },
              { text: 'LLM Response (Oct 11)', link: '/llm_response_68dd4b06ba9ce41648dba130_20251011_121956' },
              { text: 'LLM Response (Oct 11)', link: '/llm_response_68dd4b11ba9ce41648dba132_20251011_121956' },
              { text: 'LLM Response (Oct 11)', link: '/llm_response_68dd4bfe90a177dc0ad4c190_20251011_121956' },
              // Note: There are many more llm_response files that can be added similarly
            ]
          },
          
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dotZeroSlash' }
    ]
  }
}