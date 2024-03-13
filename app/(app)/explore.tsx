import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlaceCard } from '../../components/PlaceCard';
import { H1 } from '../../components/headings';

export default function ExplorePage() {
  return (
    <SafeAreaView className="bg-neutral-50 dark:bg-neutral-950 min-h-screen h-full mt-4">
      <H1>Near You</H1>
      <ScrollView className="px-6" horizontal={true}>
        <PlaceCard
          image="https://unsplash.com/photos/6PwyzRpf13w/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzEwMTA1NzI1fA&force=true&w=640"
          title="Bratislavský hrad"
          subtitle="Bratislava, Slovakia"
          url="/places/nature"
        />
        <PlaceCard
          image="https://unsplash.com/photos/6PwyzRpf13w/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzEwMTA1NzI1fA&force=true&w=640"
          title="Bratislavský hrad"
          subtitle="Bratislava, Slovakia"
          url="/places/nature"
        />
        <PlaceCard
          image="https://unsplash.com/photos/6PwyzRpf13w/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzEwMTA1NzI1fA&force=true&w=640"
          title="Bratislavský hrad"
          subtitle="Bratislava, Slovakia"
          url="/places/nature"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
