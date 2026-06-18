import { Request, Response, NextFunction } from "express";
import { HTTPStatusText } from "../../types/httpStatusText";
import CustomError from "../../utils/customError";
import { UserModel } from "../auth/auth.model";
import { QuizAnswerTracker } from "../../services/quizAnswerTracker";
import { LoggerService } from "../../utils/logger";
import { TelegramClient } from "../../intergrations/telegram/telegramClient";
import path from "path";

const MESSAGES_LOG_FILE = "logs/messages.log";
// Local GIF used as a friendly greeting animation.
// Note: we currently send this via `sendAnimation`. If animation uploads are
// unsupported or fail for some chats, a fallback strategy (e.g. sendMessage
// with a static GIF link or sendDocument) should be handled by the
// `TelegramClient` implementation or added here as needed.
// const HI_GIF_PATH = path.resolve(__dirname, "../../../data/hi.gif");
const TELEGRAM_PROFILE_COMMAND_RESPONSES: Record<string, string> = {
  github: "📌 GitHub: https://github.com/AMR856",
  start: "Hello this is Amr Alnus Telegram quiz manager, hope you'll enjoy it.",
  linkedin: "💼 LinkedIn: https://www.linkedin.com/in/amr-alnus-64a4ab244/",
  portfolio: "🌐 Portfolio: https://amralnus-backend.me/",
  "company-profile": "🏢 Company Profile: https://soulstudio.dev/",
  about: `👤 <b>About Me</b>

CEO@SoulStudioDev| Backend Engineer | Node.js | NestJS
Electronics & Communication Engineering Student

<a href="https://github.com/AMR856">GitHub</a> |
<a href="https://www.linkedin.com/in/amr-alnus-64a4ab244/">LinkedIn</a> |
<a href="https://amralnus-backend.me/">Portfolio</a>`,
  help: `📋 <b>Available Commands</b>

/github - View my GitHub profile
/linkedin - View my LinkedIn profile
/portfolio - View my portfolio website
/company-profile - View company profile website
/about - Get information about me
/help - Show this menu`,
};

const TELEGRAM_PROFILE_COMMANDS_WITH_HTML = new Set(["about", "help"]);

export class TelegramController {
  public static async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      // Extracting the userId and secret from the URL parameters to authenticate the incoming webhook request from Telegram
      const userId = String(req.params.userId || "").trim();
      const secret = String(req.params.secret || "").trim();

      // Finding the user associated with the provided webhook credentials to ensure that the request is legitimate and to identify which user's quiz answers are being tracked
      const user = await UserModel.getUserByWebhook(userId, secret);

      if (!user) {
        throw new CustomError(
          "Invalid webhook credentials",
          401,
          HTTPStatusText.FAIL,
        );
      }

      // Processing the incoming update from Telegram, specifically looking for poll answers which indicate that a user has interacted with a quiz question sent by the bot. 
      // The relevant information is extracted and passed to the QuizAnswerTracker service to keep track of users' answers and manage retries for wrong answers.
      const update = req.body || {};
      const message = update?.message;
      const messageText = String(message?.text || "").trim();
      const isStartCommand = /^\/start(?:\s|$)/i.test(messageText);
      const commandMatch = messageText.match(/^\/([a-z0-9_-]+)(?:@\w+)?(?:\s|$)/i);
      const command = String(commandMatch?.[1] || "").toLowerCase();
      const messageFromId = String(message?.from?.id || "").trim();
      const isPrivateChat = String(message?.chat?.type || "") === "private";

      if (isStartCommand && isPrivateChat && messageFromId) {
        await QuizAnswerTracker.markUserInitiatedConversation({
          ownerUserId: user.id,
          telegramUserId: messageFromId,
        });

        LoggerService.info(
          `Stored initiated conversation for owner ${user.id} and Telegram user ${messageFromId}`,
        );
      }

      if (command) {
        const responseMessage = TELEGRAM_PROFILE_COMMAND_RESPONSES[command];

        const telegramClient = new TelegramClient({
          baseUrl: `https://api.telegram.org/bot${user.botToken}`,
          isChannel: user.isChannel,
        });

        if (responseMessage) {
          await telegramClient.sendMessage(message?.chat?.id, responseMessage, {
            parseMode: TELEGRAM_PROFILE_COMMANDS_WITH_HTML.has(command)
              ? "HTML"
              : undefined,
          });
        } else {
          // Animations are temporarily disabled. Skip sending the greeting
          // animation for now to avoid accidental uploads or rate-limit issues.
          LoggerService.info(
            `Skipping greeting animation for chat ${String(message?.chat?.id)}`,
          );
        }

        return res
          .status(200)
          .json({ status: HTTPStatusText.SUCCESS, accepted: true });
      }

      if (message?.chat) {
        LoggerService.logToFile(
          MESSAGES_LOG_FILE,
          `Group ID: ${message.chat.id}`,
        );
        LoggerService.logToFile(
          MESSAGES_LOG_FILE,
          `Group name: ${message.chat.title}`
        );

        return res
          .status(200)
          .json({ status: HTTPStatusText.SUCCESS, accepted: true });
      }

      const pollAnswer = update?.poll_answer;
      // {
      //   poll_id: "poll_abc_123",
      //   user: { id: 9876543210, ... },
      //   option_ids: [0, 1]
      // }
      if (!pollAnswer?.poll_id) {
        return res
          .status(200)
          .json({ status: HTTPStatusText.SUCCESS, accepted: false });
      }

      const pollAnswerUser = pollAnswer?.user;
      if (!pollAnswerUser?.id) {
        LoggerService.warn(
          `Skipping poll answer ${String(pollAnswer.poll_id)} because poll_answer.user.id is missing`,
        );
        return res
          .status(200)
          .json({ status: HTTPStatusText.SUCCESS, accepted: false });
      }

      const telegramUserId = String(pollAnswerUser.id || "").trim();
      const telegramUserIsBot = Boolean(pollAnswerUser.is_bot);

      // If the Telegram user ID cannot be extracted from the incoming update, 
      // it means that the answer cannot be associated with a specific user, 
      // and therefore it is not possible to track the quiz answer or manage retries for wrong answers. 
      // In this case, the webhook will acknowledge the update but indicate that it was not accepted for processing.
      if (!telegramUserId) {
        return res
          .status(200)
          .json({ status: HTTPStatusText.SUCCESS, accepted: false });
      }

      // Tracking the user's answer to the quiz question by associating the Telegram user ID with the poll ID and the selected option IDs.
      await QuizAnswerTracker.trackPollAnswer({
        ownerUserId: user.id,
        pollId: String(pollAnswer.poll_id),
        telegramUserId,
        telegramUserIsBot,
        selectedOptionIds: Array.isArray(pollAnswer.option_ids)
          ? pollAnswer.option_ids
          : [],
      });

      return res
        .status(200)
        .json({ status: HTTPStatusText.SUCCESS, accepted: true });
    } catch (error) {
      return next(error);
    }
  }
}
