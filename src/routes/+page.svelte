<script lang="ts">
  import Survey from "$lib/components/Survey.svelte"

  function onAnswer(answer: any) {
    if (answer.id === "reportType" && answer.answer === "crash") {
      console.log("🚨 Calling 911")
    }
  }
</script>

<Survey
  questions={[
    {
      type: "multipleChoice",
      id: "reportType",
      prompt: "What are you reporting?",
      options: [
        {
          label: "😮‍💨 A close call",
          value: "closeCall"
        },
        {
          label: "🚧 A concern",
          value: "concern"
        },
        {
          label: "💥 A crash",
          value: "crash"
        }
      ]
    },
    {
      type: "multipleChoice",
      id: "location",
      prompt: "Where did it happen?",
      options: [
        {
          label: "This intersection",
          value: "intersection"
        },
        {
          label: "Current location",
          value: "currentLocation"
        }
      ]
    }
  ]}
  on:answer={(detail) => onAnswer(detail)}
  on:allAnswers={({ detail }) => {
    console.log(detail)
  }}
/>