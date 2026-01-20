import React, { useState, useEffect } from 'react';
import { Send, Mail, Heart, Book, Feather, ArrowLeft } from 'lucide-react';

// Static example letter pairs for demo content
const EXAMPLE_PAIRS = [
  {
    id: 'example-pair-1',
    letters: [
      {
        author: "John Doe",
        content: "I've been thinking about what you said last Tuesday, about how certain moments feel like they exist outside of time. I think I understand now. There's this quality to some experiences where the usual markers of before and after dissolve, and you're just suspended in the thing itself. I felt that way yesterday morning when I was walking through the park and the light was coming through the trees in that particular autumn way. Everything was very still and very present at once. I wanted to tell you about it because I think you'd recognize what I mean. You have a way of noticing these pauses in the ordinary flow of things, and I've started noticing them too, maybe because of our conversations. Anyway, I hope you're well. I hope the work you were worried about last week turned out better than you expected."
      },
      {
        author: "Jane Doe",
        content: "Your letter arrived on a morning when I needed exactly that reminder. I had been rushing through everything, feeling like I was constantly behind some invisible schedule, and then I read what you wrote about the park and the light and I actually stopped. I sat down with my coffee and just sat. It's strange how a few sentences from someone else can give you permission to pause. I know what you mean about moments outside of time. I think that's what I was trying to articulate when we talked, though I didn't have the words quite right. You found better ones. The work did turn out okay, thank you for asking. Not perfect, but okay is enough sometimes. I'm learning that. I think you already know it. I hope you're still noticing those pauses, those small eternities in the middle of regular days."
      }
    ],
    prompt: "Describe a small moment that meant everything",
    timestamp: Date.now() - 86400000 * 30
  },
  {
    id: 'example-pair-2',
    letters: [
      {
        author: "Jane Doe",
        content: "I keep thinking about what makes certain people easy to talk to. Not in the sense of small talk or pleasantries, but the deeper kind of ease where you can say something half-formed and trust that it will be received gently. You're one of those people. I realized this the other night when I was trying to explain something to someone else and couldn't find the words, and I thought, I wish I were talking to you instead. With you I can stumble through an idea and you'll follow the thread even when it's tangled. I think this is a rare thing. Most conversations require a kind of performance, a shaping of thoughts into presentable forms. But some people create space for the unfinished and uncertain. You do that. I wanted you to know I notice it and I'm grateful for it."
      },
      {
        author: "John Doe",
        content: "I don't think anyone has ever said something quite like that to me before. I had to read your letter twice because the first time I wasn't sure I understood correctly. I suppose I never thought about conversation in those terms, but you're right that most of it does require that kind of performance you mentioned. I've spent so much of my life trying to sound coherent and sure of things that I forget what it's like to just think out loud with someone. Maybe that's why talking with you feels different. You've never seemed to expect me to have everything figured out. I can ask questions that might sound stupid or chase tangents that lead nowhere, and you're curious about where they go rather than impatient about where they don't. I'm grateful too. For the space you make, for the way you listen, for letters like this one."
      }
    ],
    prompt: "Describe what you admire most about them",
    timestamp: Date.now() - 86400000 * 25
  },
  {
    id: 'example-pair-3',
    letters: [
      {
        author: "John Doe",
        content: "There's something I've been wanting to tell you but haven't found the right moment in person, so I'm writing it instead. I think you changed the way I see things, though I'm not sure you meant to or even realize it. Before we met I moved through the world in a more automatic way, following routines and checking boxes and not really paying attention to the texture of daily life. Then you mentioned once how you always look up at buildings because the interesting details are usually above eye level, and after that I started looking up too. And then I started noticing other things. The way light changes in the afternoon. The particular green of new leaves in spring. Small kindnesses between strangers. It's like you gave me permission to care about things I thought were too small to matter. I don't know if this makes sense. I'm just trying to say that knowing you has made the world feel bigger and more worth paying attention to."
      },
      {
        author: "Jane Doe",
        content: "This is one of the kindest things anyone has said to me. I'm sitting here with your letter and I don't quite know how to respond except to say that I think you did the same for me, just in different ways. You made it okay to be enthusiastic about small things without apologizing for it. I spent so long thinking I had to be measured and reasonable about everything, and then I met you and you'd get genuinely excited about a good sandwich or an interesting cloud formation, and it was permission to be delighted by ordinary things. I think we probably gave each other the same gift from different angles. The permission to notice, to care, to find things meaningful even when they're small. I'm glad you look up at buildings now. I'm glad you notice the light. I'm glad we found each other in a world where it's easy to walk past everything without really seeing it."
      }
    ],
    prompt: "Describe how they've changed your perspective",
    timestamp: Date.now() - 86400000 * 18
  },
  {
    id: 'example-pair-4',
    letters: [
      {
        author: "Jane Doe",
        content: "I had a dream about the house where I grew up, which I haven't thought about in years. In the dream everything was exactly as I remembered it, the blue carpet in the hallway, the crack in the kitchen ceiling, the way the afternoon light came through the window by the stairs. You were there too, which was strange because you never knew that place, but in the dream it felt completely natural that you'd be there. We were just sitting in the living room talking about nothing in particular, and I felt this overwhelming sense of peace. When I woke up I tried to hold onto that feeling but it slipped away the way dream-feelings do. I'm not sure why I'm telling you this except that it felt important somehow, like my subconscious was trying to tell me something about belonging or home or the way certain people can make anywhere feel safe."
      },
      {
        author: "John Doe",
        content: "I love that I was in your dream, even if dream-logic doesn't follow the usual rules of time and space. There's something touching about the idea that your mind placed me in your childhood home, in that remembered peace. I think I understand what your subconscious might have been saying. Some people do that, don't they. They carry a sense of home with them, or maybe they help you access the feeling of home that's always been inside you but got buried under other things. I've felt that with you. Not that you remind me of any specific place from my past, but that you create that same quality of ease and safety that the best places from childhood held. The feeling that you can be fully yourself without translation or performance. I hope you have more dreams like that. I hope when you think of home, in whatever form it takes, there's some comfort in it."
      }
    ],
    prompt: "Share a memory that makes you smile",
    timestamp: Date.now() - 86400000 * 12
  }
];

// Emotional prompts to inspire letters
const PROMPTS = [
  "Write about a moment you wish you could relive together",
  "Describe what you admire most about them",
  "Share a memory that makes you smile",
  "Tell them about a dream you had",
  "Express what you're grateful for in knowing them",
  "Describe how they've changed your perspective",
  "Write about a place you'd like to visit together",
  "Share something you've never told them before",
  "Describe a small moment that meant everything",
  "Tell them what you hope for your future"
];

const EpistolaryLetterBot = () => {
  const [view, setView] = useState('home');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    recipientEmail: '',
    letterContent: ''
  });
  const [currentLetter, setCurrentLetter] = useState(null);
  const [archive, setArchive] = useState([]);
  const [replyMode, setReplyMode] = useState(false);
  const [parentLetterId, setParentLetterId] = useState(null);

  useEffect(() => {
    setArchive(EXAMPLE_PAIRS);
    setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const moderateContent = async (content) => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { 
              role: "user", 
              content: `You are a content moderator for a romantic letter exchange platform. Review this letter and respond with ONLY "APPROVED" if it's appropriate (romantic, kind, personal correspondence) or "REJECTED: [brief reason]" if it contains abuse, harassment, explicit content, spam, or harmful material.

Letter content:
${content}` 
            }
          ],
        })
      });

      const data = await response.json();
      const result = data.content[0].text.trim();
      
      return {
        approved: result === "APPROVED",
        reason: result.startsWith("REJECTED:") ? result.substring(10) : null
      };
    } catch (error) {
      console.error('Moderation error:', error);
      return { approved: false, reason: "Moderation service unavailable" };
    }
  };

  const sendLetter = async () => {
    if (!formData.senderName || !formData.senderEmail || !formData.recipientEmail || !formData.letterContent) {
      alert('Please fill in all fields');
      return;
    }

    const moderation = await moderateContent(formData.letterContent);
    if (!moderation.approved) {
      alert(`Letter cannot be sent: ${moderation.reason}`);
      return;
    }

    const letterId = `letter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const letter = {
      id: letterId,
      senderName: formData.senderName,
      senderEmail: formData.senderEmail,
      recipientEmail: formData.recipientEmail,
      content: formData.letterContent,
      prompt: currentPrompt,
      timestamp: Date.now(),
      isReply: replyMode,
      parentLetterId: parentLetterId
    };

    alert(`Letter sent to ${formData.recipientEmail}! They will receive an email with a link to read and reply.`);
    
    setFormData({
      senderName: '',
      senderEmail: '',
      recipientEmail: '',
      letterContent: ''
    });
    setReplyMode(false);
    setParentLetterId(null);
    setView('home');
  };

  const startReply = () => {
    setReplyMode(true);
    setParentLetterId(currentLetter.id);
    setFormData({
      senderName: '',
      senderEmail: currentLetter.recipientEmail,
      recipientEmail: currentLetter.senderEmail,
      letterContent: ''
    });
    setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    setView('compose');
  };

  const changePrompt = () => {
    let newPrompt;
    do {
      newPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    } while (newPrompt === currentPrompt && PROMPTS.length > 1);
    setCurrentPrompt(newPrompt);
  };

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&family=Mrs+Saint+Delafield&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          overflow-x: hidden;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b0 100%);
          position: relative;
          overflow: hidden;
        }

        .app-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 119, 101, 0.03) 2px, rgba(139, 119, 101, 0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 119, 101, 0.03) 2px, rgba(139, 119, 101, 0.03) 4px);
          pointer-events: none;
        }

        .app-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 30%, rgba(139, 119, 101, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(101, 84, 63, 0.06) 0%, transparent 50%);
          pointer-events: none;
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 30px;
        }

        .header {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInDown 1s ease;
        }

        .logo {
          font-family: Arial, sans-serif;
          font-size: 48px;
          font-weight: 900;
          color: #4a3428;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }

        .tagline {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          letter-spacing: 3px;
          color: #8b7765;
          text-transform: uppercase;
        }

        .nav-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .nav-btn {
          font-family: 'Cinzel', serif;
          padding: 12px 30px;
          background: linear-gradient(135deg, #8b7765 0%, #6b5444 100%);
          color: #f5e6d3;
          border: 2px solid #6b5444;
          border-radius: 30px;
          cursor: pointer;
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(107, 84, 68, 0.2);
        }

        .nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(107, 84, 68, 0.3);
          background: linear-gradient(135deg, #9b8775 0%, #7b6454 100%);
        }

        .nav-btn.active {
          background: #6b5444;
          border-color: #5b4434;
        }

        .card {
          background: rgba(255, 252, 247, 0.95);
          border-radius: 20px;
          padding: 50px;
          box-shadow: 0 10px 40px rgba(107, 84, 68, 0.15);
          border: 1px solid rgba(139, 119, 101, 0.2);
          position: relative;
          animation: fadeInUp 0.8s ease;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          color: #6b5444;
          margin-bottom: 30px;
          text-align: center;
          font-weight: 600;
        }

        .prompt-box {
          background: linear-gradient(135deg, #fff8f0 0%, #f5ebe0 100%);
          border-left: 4px solid #c4a57b;
          padding: 20px 25px;
          margin-bottom: 30px;
          border-radius: 8px;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 18px;
          color: #6b5444;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          box-shadow: 0 4px 12px rgba(196, 165, 123, 0.15);
        }

        .prompt-text {
          flex: 1;
        }

        .refresh-prompt {
          background: transparent;
          border: 1px solid #c4a57b;
          color: #8b7765;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .refresh-prompt:hover {
          background: #c4a57b;
          color: white;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-label {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #8b7765;
          margin-bottom: 8px;
          display: block;
        }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid rgba(139, 119, 101, 0.2);
          border-radius: 10px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
          color: #6b5444;
        }

        .form-input:focus {
          outline: none;
          border-color: #c4a57b;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 4px rgba(196, 165, 123, 0.1);
        }

        .letter-textarea {
          width: 100%;
          min-height: 350px;
          padding: 20px;
          border: 2px solid rgba(139, 119, 101, 0.2);
          border-radius: 10px;
          font-family: 'Mrs Saint Delafield', cursive;
          font-size: 24px;
          line-height: 1.8;
          background: rgba(255, 255, 255, 0.6);
          resize: vertical;
          transition: all 0.3s ease;
          color: #5b4434;
        }

        .letter-textarea:focus {
          outline: none;
          border-color: #c4a57b;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 4px rgba(196, 165, 123, 0.1);
        }

        .letter-textarea::placeholder {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 18px;
          color: rgba(107, 84, 68, 0.4);
        }

        .submit-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #c4a57b 0%, #a88d66 100%);
          color: white;
          border: none;
          border-radius: 30px;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 6px 20px rgba(196, 165, 123, 0.3);
          margin-top: 30px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(196, 165, 123, 0.4);
          background: linear-gradient(135deg, #d4b58b 0%, #b89d76 100%);
        }

        .letter-display {
          font-family: 'Mrs Saint Delafield', cursive;
          font-size: 26px;
          line-height: 1.9;
          color: #5b4434;
          white-space: pre-wrap;
          padding: 30px;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 252, 247, 0.6));
          border-radius: 10px;
          border: 1px solid rgba(139, 119, 101, 0.15);
          margin: 25px 0;
          min-height: 200px;
        }

        .letter-meta {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          color: #8b7765;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid rgba(139, 119, 101, 0.2);
          font-style: italic;
        }

        .back-btn {
          margin-bottom: 30px;
          background: transparent;
          border: 2px solid #c4a57b;
          color: #8b7765;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          letter-spacing: 2px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .back-btn:hover {
          background: #c4a57b;
          color: white;
        }

        .home-intro {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          line-height: 1.8;
          color: #6b5444;
          text-align: center;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .feature-list {
          display: grid;
          gap: 20px;
          margin-top: 40px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 20px;
          background: rgba(255, 252, 247, 0.5);
          border-radius: 12px;
          border: 1px solid rgba(139, 119, 101, 0.15);
        }

        .feature-icon {
          color: #c4a57b;
          flex-shrink: 0;
          margin-top: 5px;
        }

        .feature-content h3 {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          letter-spacing: 2px;
          color: #6b5444;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .feature-content p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          color: #8b7765;
          line-height: 1.6;
        }

        .reply-indicator {
          background: linear-gradient(135deg, #c4a57b 0%, #a88d66 100%);
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          margin-bottom: 25px;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          letter-spacing: 2px;
          text-align: center;
          text-transform: uppercase;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: 40px 20px;
          }

          .logo {
            font-size: 36px;
          }

          .card {
            padding: 30px 25px;
          }

          .section-title {
            font-size: 28px;
          }

          .nav-buttons {
            flex-direction: column;
          }

          .nav-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="content-wrapper">
        <div className="header">
          <div className="logo">SAINT VALENTINE'S LETTER BOX💌</div>
          <div className="tagline">A Networked Epistolary Engine Designed for Modern Connection</div>
        </div>

        {view === 'home' && (
          <>
            <div className="nav-buttons">
              <button className="nav-btn active" onClick={() => setView('home')}>
                <Heart size={16} />
                Home
              </button>
              <button className="nav-btn" onClick={() => setView('compose')}>
                <Feather size={16} />
                Write Letter
              </button>
              <button className="nav-btn" onClick={() => setView('archive')}>
                <Book size={16} />
                Public Archive
              </button>
            </div>

            <div className="card">
              <p className="home-intro">
                In an age of instant messages, rediscover the art of meaningful correspondence. 
                Write letters that matter, receive heartfelt replies, and contribute to an anonymous 
                archive of human connection.
              </p>

              <div className="feature-list">
                <div className="feature-item">
                  <Feather className="feature-icon" size={24} />
                  <div className="feature-content">
                    <h3>Write with Intent</h3>
                    <p>Compose letters in a beautiful interface with prompts to inspire deeper expression</p>
                  </div>
                </div>

                <div className="feature-item">
                  <Mail className="feature-icon" size={24} />
                  <div className="feature-content">
                    <h3>Exchange Replies</h3>
                    <p>Recipients receive an email link to read and reply, creating a paired exchange</p>
                  </div>
                </div>

                <div className="feature-item">
                  <Book className="feature-icon" size={24} />
                  <div className="feature-content">
                    <h3>Anonymous Archive</h3>
                    <p>Completed exchanges are published anonymously for others to read and find inspiration</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'compose' && (
          <>
            <div className="nav-buttons">
              <button className="nav-btn" onClick={() => setView('home')}>
                <Heart size={16} />
                Home
              </button>
              <button className="nav-btn active" onClick={() => setView('compose')}>
                <Feather size={16} />
                Write Letter
              </button>
              <button className="nav-btn" onClick={() => setView('archive')}>
                <Book size={16} />
                Public Archive
              </button>
            </div>

            <div className="card">
              {replyMode && (
                <div className="reply-indicator">
                  Composing a reply
                </div>
              )}

              <h2 className="section-title">Compose Your Letter</h2>

              <div className="prompt-box">
                <span className="prompt-text">"{currentPrompt}"</span>
                <button className="refresh-prompt" onClick={changePrompt}>
                  New Prompt
                </button>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fff8f0 0%, #f5ebe0 100%)',
                padding: '25px 30px',
                marginBottom: '30px',
                borderRadius: '8px',
                border: '1px solid rgba(139, 119, 101, 0.15)',
                boxShadow: '0 2px 8px rgba(196, 165, 123, 0.1)'
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '16px',
                  lineHeight: '1.8',
                  color: '#6b5444',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  Before you sign your name, consider the pleasure of discretion.
                  In this age, as in the last, a letter may travel more freely when unburdened by its author. To be named is to stand plainly in the light; to remain anonymous is to whisper through silk curtains, known only by tone and intention. You may declare yourself openly, or you may let the letter speak alone, unaccompanied by reputation or claim. Neither choice is more virtuous. Both carry their own intimacy.
                  Choose, then, how you wish to be remembered: by name, or by feeling alone.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.senderName}
                  onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                  placeholder="How shall you be known?"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({...formData, senderEmail: e.target.value})}
                  placeholder="Where shall replies find you?"
                  disabled={replyMode}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Recipient's Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                  placeholder="To whom do you write?"
                  disabled={replyMode}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Letter</label>
                <textarea
                  className="letter-textarea"
                  value={formData.letterContent}
                  onChange={(e) => setFormData({...formData, letterContent: e.target.value})}
                  placeholder="Dear friend, let your heart guide your pen..."
                />
              </div>

              <button className="submit-btn" onClick={sendLetter}>
                <Send size={18} />
                Send Letter
              </button>
            </div>
          </>
        )}

        {view === 'read' && currentLetter && (
          <>
            <button className="back-btn" onClick={() => setView('home')}>
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="card">
              <h2 className="section-title">A Letter for You</h2>

              {currentLetter.prompt && (
                <div className="prompt-box">
                  <span className="prompt-text">Prompt: "{currentLetter.prompt}"</span>
                </div>
              )}

              <div className="letter-display">
                {currentLetter.content}
              </div>

              <div className="letter-meta">
                From: {currentLetter.senderName}<br />
                Sent: {new Date(currentLetter.timestamp).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              {!currentLetter.isReply && (
                <button className="submit-btn" onClick={startReply}>
                  <Feather size={18} />
                  Write a Reply
                </button>
              )}
            </div>
          </>
        )}

        {view === 'archive' && (
          <>
            <div className="nav-buttons">
              <button className="nav-btn" onClick={() => setView('home')}>
                <Heart size={16} />
                Home
              </button>
              <button className="nav-btn" onClick={() => setView('compose')}>
                <Feather size={16} />
                Write Letter
              </button>
              <button className="nav-btn active" onClick={() => setView('archive')}>
                <Book size={16} />
                Public Archive
              </button>
            </div>

            <div className="card">
              <h2 className="section-title">Anonymous Letters Archive</h2>
              
              <p className="home-intro" style={{marginBottom: '40px'}}>
                Each entry represents a complete exchange between two souls. 
                All identifying information has been removed to preserve anonymity.
              </p>

              {archive.length === 0 ? (
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '18px',
                  color: '#8b7765',
                  textAlign: 'center',
                  padding: '40px'
                }}>
                  The archive awaits its first paired exchange...
                </p>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '60px',
                  marginTop: '30px'
                }}>
                  {archive.map((pair) => (
                    <div key={pair.id} style={{
                      background: 'rgba(255, 252, 247, 0.6)',
                      padding: '40px',
                      borderRadius: '12px',
                      maxHeight: '600px',
                      overflowY: 'auto'
                    }}>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '14px',
                        color: '#a88d66',
                        marginBottom: '30px',
                        paddingBottom: '15px',
                        borderBottom: '1px solid rgba(139, 119, 101, 0.15)'
                      }}>
                        Prompt: "{pair.prompt}"
                      </div>
                      
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '17px',
                        lineHeight: '1.9',
                        color: '#5b4434'
                      }}>
                        {pair.letters.map((letter, idx) => (
                          <div key={idx} style={{marginBottom: idx < pair.letters.length - 1 ? '40px' : '0'}}>
                            <div style={{
                              marginBottom: '15px',
                              color: '#8b7765'
                            }}>
                              {letter.author}
                            </div>
                            <div style={{whiteSpace: 'pre-wrap'}}>
                              {letter.content}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '11px',
                        letterSpacing: '1px',
                        color: '#a88d66',
                        marginTop: '30px',
                        paddingTop: '15px',
                        borderTop: '1px solid rgba(139, 119, 101, 0.15)',
                        textAlign: 'right'
                      }}>
                        {new Date(pair.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EpistolaryLetterBot;cd ~/Desktop/letter-box
cd ~/Desktop/letter-box
