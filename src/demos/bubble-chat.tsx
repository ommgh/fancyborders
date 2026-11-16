import { BubbleFrame } from "@/components/bubble-frame";

export default function BubbleChat() {
  return (
    <div className="grid w-full max-w-sm gap-3 text-sm">
      <BubbleFrame
        side="left"
        at={-18}
        fill="var(--background)"
        className="justify-self-start px-4 py-2.5"
      >
        Is the new border live?
      </BubbleFrame>
      <BubbleFrame
        side="right"
        at={-18}
        fill="var(--color-sky-500)"
        color="var(--color-sky-600)"
        className="justify-self-end px-4 py-2.5 text-white"
      >
        Deployed a minute ago.
      </BubbleFrame>
      <BubbleFrame
        side="left"
        at={-18}
        fill="var(--background)"
        className="justify-self-start px-4 py-2.5"
      >
        It goes all the way round the tail!
      </BubbleFrame>
    </div>
  );
}
