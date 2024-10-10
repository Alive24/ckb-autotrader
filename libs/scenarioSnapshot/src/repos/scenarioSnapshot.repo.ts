import { ScenarioSnapshot, ScenarioSnapshotStatus } from "@app/schemas";
import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class ScenarioSnapshotRepo extends Repository<ScenarioSnapshot> {
  constructor(manager: EntityManager) {
    super(ScenarioSnapshot, manager);
  }

  async syncScenarioSnapshot(
    scenarioSnapshot: ScenarioSnapshot,
  ): Promise<void> {
    const scenarioSnapshotInDb = await this.findOneBy({
      timestamp: scenarioSnapshot.timestamp,
    });
    if (scenarioSnapshotInDb !== undefined) {
      await this.save(scenarioSnapshot);
      scenarioSnapshot.scenarioSnapshotStatus = ScenarioSnapshotStatus.Stored;
      await this.update(
        { timestamp: scenarioSnapshot.timestamp },
        {
          actionGroupStatus: scenarioSnapshot.actionGroupStatus,
          scenarioSnapshotStatus: scenarioSnapshot.scenarioSnapshotStatus,
          updatedAt: new Date(),
        },
      );
    } else {
      //TODO: May change this to partial update.
      await this.update(
        { timestamp: scenarioSnapshot.timestamp },
        {
          actionGroupStatus: scenarioSnapshot.actionGroupStatus,
          scenarioSnapshotStatus: scenarioSnapshot.scenarioSnapshotStatus,
        },
      );
    }
    return;
  }
}
